const express = require('express');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const path = require('path');

const app = express();
app.use(express.json());

const uri = "mongodb+srv://tgacquin:iriZjkp5YV7zq3P9@cluster0.4zzdwnk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("YourDatabaseName");
const usersCollection = database.collection("users");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
