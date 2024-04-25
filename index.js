const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;

//------------------ Middle Ware Hare------------

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.fp7vkua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();


    // ----------------Creating database and collection
    const coffeeCollection = client.db("CoffeeDB").collection("Coffees");


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //-----------Send data client side-----------

    app.get("/", async (req, res) => {
      const data = coffeeCollection.find();
      const coffeeData = await data.toArray();
      res.send(coffeeData)
    })

    // -----------Delete coffee to database---------
    app.delete("/:id", async(req , res)=>{
      const id =  req.params.id;
      const machId = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(machId);
      res.send(result)
    })


    // -------- Get Data From Client Side---------

    app.post("/new-coffee", async (req, res) => {
      const newCoffee = req.body
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)

    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Running port in : ${port}`)
})