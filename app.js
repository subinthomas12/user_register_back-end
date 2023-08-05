const express = require('express');
const app = express();
const port = 5000;
// app.use(cors());
app.use(express.json());
// var jsonParser = bodyParser.json()
const { MongoClient } = require('mongodb');

// app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the home page!');
});

const uri = "mongodb+srv://root:<root>@cluster0.sghq5zt.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/register', (req, res) => {
  console.log("req", req);
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  let result = "";
  console.log("User data", userData)
  try {
    result = client.db("le_eyes").collection("users").updateOne(
      {
        $push: {
          users: userData
        }
      }
    ).then(result => {
      if (result) {
        if (result.acknowledged === true && result.modifiedCount === 1) {
          return res.send({ msg: "User registered", data: { username: req.body.name } });
        }
        else {
          return res.send({ msg: "User not created", data: { username: req.body.name } });
        }
      }
    })
      .catch((error) => {
      })

  }
  catch (error) {
    console.log("Something went wrong", error);
    return res.send({ msg: "Something went wrong", data: "" })
  }
});

async function main() {
  try {
    await client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
    });
    // dbConnection = db.db("testimonial")
    console.log("Connection Success")
    // await findLists(client);

  } catch (e) {
    console.error(e);
  }

}
main().catch(console.error);
