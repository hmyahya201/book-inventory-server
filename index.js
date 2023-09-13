const express = require("express")
const app = express()
const cors = require("cors")
 require('dotenv').config()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.p43vn94.mongodb.net/?retryWrites=true&w=majority`;

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

    const bookCollection = client.db("bookStore").collection("books")

    app.get('/all-books', async(req, res)=>{
      const result = await bookCollection.find().toArray()
      res.send(result)
    })

    app.get('/edit-book/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await bookCollection.findOne(filter)
      res.send(result)
    })
    
    app.get('/book-details/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await bookCollection.findOne(filter)
      res.send(result)
    })

    app.post('/upload-book', async(req, res)=>{
      const data = req.body
      const result = await bookCollection.insertOne(data)
      res.send(result)
    })

    app.patch('/update-book/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updateBook = req.body
      const updatedDoc = {
         $set: {...updateBook}
      }
      const result = await bookCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    app.delete('/delete-book/:id', async(req, res)=>{
      try{
         const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await bookCollection.deleteOne(filter)
      res.send(result)
      }
      catch{
         res.send(erro.message)
      }
    })

    app

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
   res.send("Hello world this is my book-inventory")
})

app.listen(port, (req, res)=>{
   console.log(`the server is running in the port of ${port}`)
})