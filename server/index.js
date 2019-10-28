const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const randomize = require('randomatic');
const tokenVerification = require('./verification');

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
app.use(express.json({
  limit: '2000001'
}));

app.use(express.static('files'));

/* Database schemas & models */
const { candidateAccountModel, userAccountModel } = require('./database/models');


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
app.get('/api/auth', tokenVerification, (req, res) => {
  console.log("==>   /api/auth   <==");

  const { email, userState } = req.body;
  res.status(200).send({ email, userState });
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
app.get('/api/userInfo', tokenVerification, async (req, res) => {
  console.log("--> /api/userInfo <--");

  try {
    const data = await userAccountModel.find({ email: req.body.email }, { _id: 0, password: 0, creationDate: 0 });
    res.status(200).send({ data: data[0] });
  } catch (e) {
    res.status(500).send();
  }
});




/*
  @route:  /api/profil/picture
  @method: PUT
  @params:
    @string picture
    @string type
*/
app.put('/api/profil/picture', tokenVerification, async (req, res) => {
  // console.log(req.body);

  try {
    const data = await candidateAccountModel.find({ email: req.body.email }, { _id: 1, picture: 1 });
    if (data.length === 0)
      throw 'Account not found';


    const userDirPath = __dirname + '/files/' + data[0]._id;
    fs.mkdir(userDirPath, async function(err) {
      if (err === null || (err && err.code === 'EEXIST')) {
        // Format the data
        let base64data = req.body.picture.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');


        // Format the name
        const rd = randomize('Aa0', 15);
        const dbPicturePath = `/pp-${rd}.${req.body.type}`;
        const servPicturePath = userDirPath + dbPicturePath;


        // Remove the old img
        if (data[0].picture !== '')
          fs.unlink(__dirname + '/files' + data[0].picture, e => console.log(e));


        // Create the new img
        fs.writeFile(servPicturePath, base64data, 'base64', async (e) => {
          if (e) throw e;
          else
          {
            const resData = await candidateAccountModel.updateOne({ email: req.body.email }, { picture: '/' + data[0]._id +  dbPicturePath });
            if (resData.n === 1 && resData.ok === 1) {
              res.status(200).send({ path: '/' + data[0]._id +  dbPicturePath })
              return;
            }
          }
        });
      }
      else
        throw 'syscall error';
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




/*
  @route:   /api/profil/description
  @method:  PUT
  @params:
    @string description
*/
app.put('/api/profil/description', tokenVerification, async (req, res) => {
  console.log('\n--> /api/profil/description');
  try {
    const { description } = req.body;
    const resData = await candidateAccountModel.updateOne({ email: req.body.email }, { description })
    if (resData.n === 1 && resData.ok === 1)
      res.status(200).send();
    else
      throw 'Update error';
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




/*
  @route:   /api/profil/email
  @method:  PUT
  @param:
    @string data
*/
app.put('/api/profil/email', tokenVerification, async (req, res) => {
  console.log('--> EMAIL API ')

  const { email, data, userState } = req.body;
  try {
    const resData = await candidateAccountModel.updateOne({ email }, { email: data });
    console.log(resData);
    const token = jwt.sign({ email: data, userState }, jwtSecret, { expiresIn: 1000 * 60 * 60 * 24 });
    res.status(200).send({ token })
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }

  return;
})




/*
  @route:   /api/profil/skills/add
  @method:  PUT
  @param:
    @object data
*/
app.put('/api/profil/skills/add', tokenVerification, async (req, res) => {
  console.log('--> /api/profil/skills/add');

  const { data, email } = req.body;

  try {
    const rdata = await candidateAccountModel.findOneAndUpdate({ email }, { $push: { skills: data }, updated: new Date() }, { new: true });
    if (rdata)
      res.status(200).send(rdata.skills[rdata.skills.length - 1]);
    else
      throw 'account error (/skill/add)';
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




/*
  @route:   /api/profil/skills/remove
  @method:  PUT
  @param:
    @object data
*/
app.put('/api/profil/skills/remove', tokenVerification, async (req, res) => {
  const { data, email } = req.body;

  console.log('-> SKILLS REMOVE')
  try {
    const rdata = await candidateAccountModel.updateOne({ email }, { $pull: { skills: { _id: data._id }}, updated: new Date() });

    if (rdata.nModified === 1 && rdata.ok === 1 && rdata.n === 1)
      res.status(200).send();
    else
      throw 'account error (/skill/remove)';
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});




/*
  @route:   /api/profil/skills/update
  @method:  PUT
  @param:
    @object data
*/
app.put('/api/profil/skills/update', tokenVerification, async (req, res) => {
  const { data, email } = req.body;

  try {
    const rdata = await candidateAccountModel.findOneAndUpdate(
      { email, skills: { $elemMatch: { _id: data._id, name: data.name, xp: data.xp }}},
      { $set: { "skills.$.xp": data.updatedXp }, updated: new Date() },
      { new: true }
    );

    if (rdata)
      res.status(200).send(rdata.skills);
    else
      throw 'account error (/skill/update)';
  } catch (e) {
    res.status(500).send();
  }
});




/*
  @route:   /api/profil/:info
  @method:  PUT
  @param:
    @string data
*/
app.put('/api/profil/:info', tokenVerification, async(req, res) => {
  const { info } = req.params;
  const { data, email } = req.body;
  
  console.log('--> /api/profil/' + info);
  console.log(data)
  try {
    const resData = await candidateAccountModel.updateOne({ email }, { [info]: (info === 'age' || info === 'prefixPhoneNumber' || info === 'phoneNumber') ? parseInt(data) : data, updated: new Date() });
    if (resData.nModified === 1)
      res.status(200).send();
    else
      throw 'User Update Error';
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




/*
  @route:   /api/candidate/settings
  @method:  GET
*/
app.get('/api/candidate/settings', tokenVerification, async (req, res) => {
  console.log('-> /api/candidate/settings');
  const { email } = req.body;
  try {
    const udata = await candidateAccountModel.find({ email }, { settings: 1 });
    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(200).send(udata[0].settings);
  }
  catch (e) {
    res.status(500).send();
  }
});




// Run the server.
app.listen(port, () => console.log(`Server running on port:${port}`));