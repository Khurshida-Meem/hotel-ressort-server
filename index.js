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

// https://hotel-ressort.herokuapp.com/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yaa9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('hotel_ressort')
        const productsCollection = database.collection('rooms');
        const bookingCollection = database.collection('bookings');

        // GET API
        app.get('/rooms', async (req, res) => {
            const cursor = productsCollection.find({});
            const rooms = await cursor.toArray();
            res.send(rooms);
        });

        // GET DYNAMIC ID
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const room = await productsCollection.findOne(query);
            res.send(room);
        });

        // Add Orders API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });
        // GET all bookings
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // get booking data by email using post request
        app.post('/bookings/byEmail', async (req, res) => {

            const email = req.body;
            const query = { email: { $in: email } }
            const booking = await bookingCollection.find(query).toArray();
            res.send(booking);
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