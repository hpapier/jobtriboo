const express = require("express");
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwtSecret = "qkslfkjdsq123RESFRZ2sdsdf";
const app = express();

const port = 3001;

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000'
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:12345/jobTriboo', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => console.log('Connected to mongodb'));
db.on('error', console.error.bind(console, 'connection error:'));


/* Middleware */
app.use(cors(corsOptions));
app.use(express.json());

/* Database schemas & models */

const userAccountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  creationDate: { type: Date, default: Date.now }
});

const userAccountModel = mongoose.model('userAccount', userAccountSchema);

const announceSchema = new mongoose.Schema({
  company: String,
  salary: { min: Number, max: Number },
  title: String,
  triboo: String,
  publicId: Number
});

const announceModel = mongoose.model('announce', announceSchema);


// Basic route
app.get('/', (req, res) => res.send("Hello Server."));


//
app.get('/api/sample', async (req, res) => {
  // try {

  // } catch (e) {

  // }

  res.status(200).send({
    triboo: ['commercial', 'tech', 'ingénieurie', 'scientifique'],
    sample: [{
      id: 0,
      triboo: 'commercial',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    }, 
    {
      id: 1,
      triboo: 'commercial',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 2,
      triboo: 'commercial',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 4,
      triboo: 'commercial',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 5,
      triboo: 'tech',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    }, 
    {
      id: 6,
      triboo: 'tech',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 7,
      triboo: 'tech',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 8,
      triboo: 'tech',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 9,
      triboo: 'ingénieurie',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    }, 
    {
      id: 10,
      triboo: 'ingénieurie',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 11,
      triboo: 'ingénieurie',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 12,
      triboo: 'ingénieurie',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 13,
      triboo: 'scientifique',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    }, 
    {
      id: 14,
      triboo: 'scientifique',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 15,
      triboo: 'scientifique',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },
    {
      id: 16,
      triboo: 'scientifique',
      title: 'Sample title',
      body: 'Sample text lorem ipsum lorem ipsum lorem ipsum.'
    },]
  })
});


// "/api/auth" route check the validity of a token passed via authorization header.
app.get('/api/auth', (req, res) => {
  console.log("==>   /api/auth   <==");

  // Get the token passed via authorization header.
  const token = req.headers.authorization;

  // Check the token content and return 401 error if it's equal to null.
  if (token === null)
    res.status(401).send();

  // Verify the token.
  try {
    jwt.verify(token, jwtSecret);
    res.status(200).send();
  } catch (e) {
    res.status(401).send();
  }

});




// "/api/login" route log the user in.
app.post('/api/authentication', async (req, res) => {
  console.log("==> /api/authentication route <==");

  const body = req.body;
  try {
    const data = await userAccountModel.find({ email: body.email });
    if (data.length === 0)
      res.status(403).send();
    else if (!(await bcrypt.compare(body.password, data[0].password)))
      res.status(403).send();
    else {
      const token = jwt.sign({ email: body.email }, jwtSecret, { expiresIn: 1000 * 60 * 60 * 24 });
      res.status(200).send({ token });
    }
  } catch (e) {
    res.status(500).send();
  }


  return;
});


// "/api/register" route create an account for user.
app.post('/api/register', async (req, res) => {
  console.log("===>   /api/register route   <===");

  console.log(req.body);
  const { firstName, lastName, email, password, birthDate } = req.body;

  let itemFind = [];

  try {
    itemFind = await userAccountModel.find({ email });
  } catch (e) {
    res.status(500).send();
  }

  if (itemFind.length !== 0)
    res.status(200).send({ status: 'email already used' });
  else {
    
    const cryptedPwd = await bcrypt.hash(password, saltRounds);
    console.log(cryptedPwd);

    const newAccount = new userAccountModel({ firstName, lastName, email, password: cryptedPwd,  birthDate });
  
    try {
      await newAccount.save();
      const token = jwt.sign({ email }, jwtSecret, { expiresIn: 1000 * 60 * 60 * 24 });
      res.status(201).send({ token });
    } catch (e) {
      console.error("==> ERROR WHEN CREATING AN ACCOUNT:");
      console.error(e);
      res.status(500).send();
    }
  }


  return;
});

// Run the server.
app.listen(port, () => console.log(`Server running on port:${port}`));