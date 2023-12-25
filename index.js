const express = require("express")
const app =express();
const cors =  require("cors")
require("dotenv").config();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware using 
app.use(cors())
app.use(express.json())




// set up the MONGODB 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kit4epp.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const taskcollection = client.db('tasks').collection('task')

 app.post('/taskifo',async (req,res)=>{
     const task = req.body
     const result= await taskcollection.insertOne(task)
     res.send(result) 
 })

 app.get('/taskinfo',async(req,res)=>{
    const result = await taskcollection.find().toArray()
    res.send(result)
 })

 app.delete('/taskinfo/:id',async(req,res)=>{
     const id =req.params.id
     const query= {_id : new ObjectId(id)}
     const result =await taskcollection.deleteOne(query)
     res.send(result)

 })

 app.patch('/taskinfo/:id',async(req,res)=>{
  const item = req.body
  const id = req.params.id
  const filter = {_id : new ObjectId(id)}
  const updatedDoc={
    $set :{
      name: item.title,
      description :item.description,
      deadline :item.deadline,
      priority : item.priority 
    }
  }
  const result = await taskcollection.updateOne(filter,updatedDoc)
 res.send(result)
 })

app.get('/',(req,res)=>{
    res.send('Job-task assignmnent is running ')
})










app.listen(port,()=>{
    console.log(`job-task assignment is running on port :${port}`);
})