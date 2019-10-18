const express = require("express");
const jwt = require("jsonwebtoken");
const { handleInputText, handleInputEmail, handleInputPrefix, handleInputNumber } = require('./utils/input');

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

const basicAccountSchema = new mongoose.Schema({
  state: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  prefixPhoneNumber: String,
  phoneNumber: String,
  creationDate: { type: Date, default: Date.now }
});

const accountInformationSchema = new mongoose.Schema({
  picture: { type: String, default: '' },
  description: { type: String, default: '' },
  country: { type: String, default: '' },
  age: { type: Number, default: 18 },
  triboo: { type: String, default: 'commercial' },
  jobName: { type: String, default: '' },
  skills: { type: [{ name: String, xp: Number }], default: [] },
  studyLvl: { type: String, default: '' },
  cv: { type: String, default: '' },
  desiredContract: { type: String, default: 'indifferent' },
  salaryExpected: { 
    min: { type: Number, default: 15 },
    max: { type: Number, default: 100 }
  },
  availability: { type: String, default: 'now' },
  updated: { type: Date, default: Date.now }
});

const userAccountModel = mongoose.model('BasicUserAccount', basicAccountSchema, 'userAccount');

const candidateAccountSchema = new mongoose.Schema();
candidateAccountSchema.add(basicAccountSchema).add(accountInformationSchema);
const candidateAccountModel = mongoose.model('CandidateAccount', candidateAccountSchema, 'userAccount');

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
app.get('/api/auth', async (req, res) => {
  console.log("==>   /api/auth   <==");

  // Get the token passed via authorization header.
  const token = req.headers.authorization;
  
  // Check the token content and return 401 error if it's equal to null.
  if (token === null)
    res.status(401).send();
  
    // Verify the token.
    try {
      const verifTk = await jwt.verify(token, jwtSecret);
      res.status(200).send({ userState: verifTk.userState });
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
      const token = jwt.sign({ email: data[0].email, userState: data[0].state }, jwtSecret, { expiresIn: 1000 * 60 * 60 * 24 });
      res.status(200).send({ token, userState: data[0].state });
    }
  } catch (e) {
    res.status(500).send();
  }


  return;
});


/*
  @route:  /api/register
  @method: POST
  @param:
    @string userState
    @string firstName
    @string lastName
    @string email
    @string password
    @string prefixPhoneNumber
    @string phoneNumber
*/
app.post('/api/register', async (req, res) => {

  const { userState, firstName, lastName, email, password, prefixPhoneNumber, phoneNumber } = req.body;

  /* Check the validity of the information received. */
  if (
    !handleInputText(firstName) ||
    !handleInputText(lastName) ||
    !handleInputEmail(email) ||
    !handleInputText(password) ||
    !handleInputPrefix(prefixPhoneNumber) ||
    !handleInputNumber(phoneNumber)
  ) {
    res.status(200).send({ errorMsg: 'formatError' });
    return;
  }
    
  /* Check the availibility of the email received. */
  let itemFind = [];

  try {
    itemFind = await userAccountModel.find({ email });
  } catch (e) {
    res.status(500).send();
    return;
  }

  if (itemFind.length !== 0)
    res.status(200).send({ errorMsg: 'notAvailable' });
  else {
    const cryptedPwd = await bcrypt.hash(password, saltRounds);

    let newAccount;
    if (userState === 'recruiter')
      newAccount = new userAccountModel({ state: userState, firstName, lastName, email, password: cryptedPwd, prefixPhoneNumber, phoneNumber });
    else
      newAccount = new candidateAccountModel({ state: userState, firstName, lastName, email, password: cryptedPwd, prefixPhoneNumber, phoneNumber });

    try {
      await newAccount.save();
      const token = jwt.sign({ email }, jwtSecret, { expiresIn: 1000 * 60 * 60 * 24 });
      res.status(201).send({ token, userState });
    } catch (e) {
      console.error("==> ERROR WHEN CREATING AN ACCOUNT:");
      console.error(e);
      res.status(500).send();
    }
  }

  return;
});


/*
  @route:  /api/userInfo
  @method: GET
*/
const tokenVerification = async (req, res, next) => {
  console.log("==> token verification <==");

  // Get the token passed via authorization header.
  const token = req.headers.authorization;
  
  // Check the token content and return 401 error if it's equal to null.
  if (token === null)
    res.status(401).send();
  
  // Verify the token.
  try {
    const data = jwt.verify(token, jwtSecret);
    req.body.email = data.email;
    next();
  } catch (e) {
    res.status(401).send();
  }
}


app.get('/api/userInfo', tokenVerification, async (req, res) => {
  console.log("--> /api/userInfo <--");

  try {
    const data = await userAccountModel.find({ email: req.body.email }, { _id: 0, password: 0, creationDate: 0 });
    res.status(200).send({ data: data[0] });
  } catch (e) {
    res.status(500).send();
  }
});

// Run the server.
app.listen(port, () => console.log(`Server running on port:${port}`));