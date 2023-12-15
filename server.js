const portNumber = 5001;
const express = require('express');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const app = express();
const path = require('path');
const bodyParser = require("body-parser"); /* To handle post parameters */

/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended:false}));


/* Setting path to use ejs templates*/
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

/* Setting path to use js and css files */
const publicPath = path.resolve(__dirname, "serverStaticFiles");
app.use('/serverStaticFiles', express.static(publicPath));

app.use(express.json());

app.get("/", (request, response) => {
    response.render("index");
});

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

const server = app.listen(portNumber, () => {
    console.log(`Web server is running at http://localhost:${portNumber}`);
}); 

const uri = "mongodb+srv://tgacquin:iriZjkp5YV7zq3P9@cluster0.4zzdwnk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("YourDatabaseName");
const usersCollection = database.collection("users");

app.post('/login', async (req, res) => {
    try {
        await client.connect();
        const { username, password } = req.body;
        // Here you can add code to hash the password before storing it
        const result = await usersCollection.insertOne({ username, password });
        res.status(200).json({ message: "User added", userId: result.insertedId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error processing request" });
    } finally {
        await client.close();
    }
});