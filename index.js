/* 
.env
DB_USER=emaJohnDB
DB_PASS=iwg87I48MaDbqCys */

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmunlsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("emaJohnDB").collection("products");

    app.get("/products", async (req, res) => {
      // 4.2 get the data from client side using query to check

      console.log("pagination query", req.query);
      // 4.4 convert to number

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // commented as we send with page and size with query on 4.5
      // const result = await productCollection.find().toArray();
      // 4.5
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    // 1.0 my requirement is create document count for pagination.
    // Note: the concept of pagination show page numbers sequentially in ui i.e 1 2 3 4 etc. On clicking the page number it will redirect to that page and show the products of that page.

    app.get("/productsCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      // 1.1 send the count as object
      res.send({ count }); //now in browser url type http://localhost:5000/productsCount u will get the {"count": 76}
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy shopping");
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
