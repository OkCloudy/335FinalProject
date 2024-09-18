const portNumber = 5001;
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser"); /* To handle post parameters */

/* Setup for mongoDB */
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') }) 
 /* Our database and collection */
const { MongoClient} = require('mongodb');
const { request } = require('http');
const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const client = new MongoClient(uri); 
connectToDB();

const session = require('express-session');
const store = new session.MemoryStore();

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store
}));

/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended:false}));

/* Setting path to use ejs templates*/
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

/* Setting path to use js and css files */
const publicPath = path.resolve(__dirname, "serverStaticFiles");
app.use('/serverStaticFiles', express.static(publicPath));

app.use(express.json());

/* Server and Mongo Connection */
const server = app.listen(portNumber, () => {
    console.log(`Web server is running at http://localhost:${portNumber}`);
}); 

/* MongoDB Connection */
async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

/* Endpoint for loading up home page */
app.get("/", (request, response) => {
    response.render("index", {userNotFound: false});
});

/* Endpoint for loading sign up page */
app.get("/signUp", (request, response) => {
    response.render("signUp", {passwordConfirmed: true, userNameTaken: false});
});

/* Endpoint for post req of user signing up */
app.post("/signUp", async (request, response) => {
    try {
        let {signUpUsername, signUpPassword, confirmPassword} = request.body;

        // Searching if user is already in database
        let userInfo = {username: signUpUsername};
        const takenUser = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .findOne(userInfo);
        if (takenUser) {
            console.log("Username taken")
            response.render("signUp", {passwordConfirmed: true, userNameTaken: true});
            return;
        }
        // Checking if password confirmation is correct
        if (signUpPassword !== confirmPassword) {
            response.render("signUp", {passwordConfirmed: false, userNameTaken: false});
            return;
        }

        let newUser = {username: signUpUsername, password: signUpPassword, tasks: []};
        const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .insertOne(newUser);
        response.redirect("/");
    } catch (error) {
        response.status(500).send(error.message);
    }
});

/* Endpoint for user logging in */
app.post("/login", async (request, response) => {
    let {username, password} = request.body;
    let userInfo = {username, password};

    // Searching user up in database
    const result = await client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .findOne(userInfo);

    if (result !== null) {
        console.log("logged in")
        console.log(result);
        request.session.user = {
            username: result.username,
            tasks: result.tasks
        }
        console.log(request.session)
        response.redirect("/todo");
    } else {
        response.render("index", {userNotFound: true });
    }
});

app.get("/session-data", (request, response) => {
    try {
        console.log("session data get: ",request.session.user.username)
        response.json(request.session.user)
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send('no more cookies');
    }
});

/* Endpoint that gets random quotes from the quotes API */
app.get("/get-quote", async (request, response) => {
    try {
        const resp = await fetch("https://zenquotes.io/api/random/");
        const data = await resp.json();
        response.send(data);
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).send('Error fetching quote');
    }
});

// ToDo endpoints

app.get("/todo", (request, response) => {
    console.log("stuff", store)
    response.render("todo");
});

app.post("/update-task", async (request,response) => {
    try {
        console.log("Updating")
        //console.log(request.session.user.username)
        console.log(`Task Text: ${request.body.tasks}`)

        let user = {username: request.session.user.username}

        let update = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .updateOne(
            user,
            { $set: {tasks: request.body.tasks}}
        );

        request.session.user.tasks = request.body.tasks
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send('Error');
    }
    
});