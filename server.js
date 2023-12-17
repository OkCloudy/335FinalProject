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

/* User session stuff that i did not get to
app.use(session({
    // Session configuration
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
})); */

/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended:false}));

/* Setting path to use ejs templates*/
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

/* Setting path to use js and css files */
const publicPath = path.resolve(__dirname, "serverStaticFiles");
app.use('/serverStaticFiles', express.static(publicPath));

/* Can't remember what this does just stealing it from lecture */
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
    response.render("index", {port: portNumber, userNotFound: false});
});

/* Endpoint for loading sign up page */
app.get("/signUp", (request, response) => {
    response.render("signUp", {port: portNumber, passwordConfirmed: true});
});

/* Endpoint for post req of user signing up */
app.post("/signUp", async (request, response) => {
    try {
        let {signUpUsername, signUpPassword, confirmPassword} = request.body;
        if (signUpPassword !== confirmPassword) {
            response.render("signUp", {port: portNumber, passwordConfirmed: false});
            return;
        }
        let newUser = {username: signUpUsername, password: signUpPassword};
        const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .insertOne(newUser);
        response.render("index", {port: portNumber, userNotFound: false});
    } catch (error) {
        response.status(500).send(error.message);
    }
});

/* Endpoint for user logging in */
app.post("/login", async (request, response) => {
    
    let {username, password} = request.body;
    let userInfo = {username, password};
    const result = await client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .findOne(userInfo);
    if (result !== null) {
        response.render("todo");
        request.session.username = result.username;
    } else {
        response.render("index", {port: portNumber, userNotFound: true });
    }
});

/* Endpoint that gets random quotes from the API */
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

/* Endpoint for getting to do lists based on the date that i never finished 
app.post("/todo", async (request, response) => {
    if (!request.session.username) {
        return response.status(401).send('User not logged in');
    }

    const username = request.session.username;
    const selectedDate = request.body.date;
    
    const userTodos = await client.db(databaseAndCollection.db)
                                  .collection(databaseAndCollection.collection)
                                  .findOne({ username: username, 'todos.date': selectedDate });

    if (userTodos) {
        const todoList = userTodos.todos.find(todo => todo.date === selectedDate);
        response.send({ todoList: todoList });
    } else {
        response.send({ todoList: [] });
    }
});*/

/* Functionality to delete from DB that i never got to :( 
app.delete('/delete-task/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    // Assuming 'username' is stored in the session and each task is tied to a username
    const username = req.session.username;

    // Delete the task from the database
    // The actual implementation depends on your database and schema
    try {
        await client.db(databaseAndCollection.db)
                    .collection(databaseAndCollection.collection)
                    .updateOne(
                        { username: username },
                        { $pull: { tasks: { id: taskId } } }  // Assuming each task has an 'id' field
                    );
        res.status(200).send('Task deleted');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
}); */