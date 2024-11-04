const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 9000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aezqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const userCollection = client.db("userManagementDB").collection("users")

        // method-1
        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        // method-2
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // method-3
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result);
        })

        // method-4
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        // method-5
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedUser = req.body
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    status: updatedUser.status,
                    gender: updatedUser.gender
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('done')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})