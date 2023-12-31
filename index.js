const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcnyajy.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("Taskdb").collection("task");

    app.post('/task', async (req, res) => {
      const taskInfo = req.body
      const result = await taskCollection.insertOne(taskInfo)
      res.send(result)
    })

    app.get('/task', async (req, res) => {
      const email = req.query.email
      const status = req.query.status
      console.log(email)
      let query = { email }
      if (status) {
        query.status = { status }
      }
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`Manage server is running on ${port}`)
})