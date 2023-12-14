const express = require('express');
const app = express();  /* app is a request handler function */
const path = require('path');
const prompt = "Stop to shutdown the server: ";
const bodyParser = require("body-parser"); /* To handle post parameters */

app.use(express.json());

/* Setup for mongoDB */
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') }) 
 /* Our database and collection */
const { MongoClient} = require('mongodb');
const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = {db: "CMSC335_DB", collection:"campApplicants"};
const client = new MongoClient(uri); 

async function connectToDB() {
    try {
        await client.connect();
       // console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

connectToDB();