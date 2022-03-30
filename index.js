const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5qzw3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');
        //GET API 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArry()
            res.send(services)
        })
        // post api
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });
    }
    finally {
        //await client.close
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Car Server')
});

app.listen(port, () => {
    console.log('Running server on port', port)
})