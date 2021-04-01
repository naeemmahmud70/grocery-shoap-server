const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("grocery").collection("products");

  app.get('/products', (req, res)=>{
    productsCollection.find()
    .toArray((err, items)=>{
      res.send(items)
    })
  })



  app.get('/product/:id',(req, res)=>{
    productsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0])
      console.log(documents)
    })
  })



  app.post('/addProduct', (req, res)=>{
    const newProduct = req.body;
    console.log('adding new product:', newProduct)
    productsCollection.insertOne(newProduct)
    .then(result=>{
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})