const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yaa9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('hotel_ressort')
        const productsCollection = database.collection('rooms');

        // GET API
        app.get('/rooms', async (req, res) => {
            const cursor = productsCollection.find({});
            console.log(cursor);
            const rooms = await cursor.toArray();
            res.send(rooms);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("running the CRUD server");
});

app.listen(port, () => {
    console.log("Running server on port ", port);
})