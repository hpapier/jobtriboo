const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const randomize = require('randomatic');
const { recruiterTokenCheck, candidateTokenCheck, basicTokenCheck } = require('./verification');

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
mongoose.connect('mongodb://0.0.0.0:12345/jobTriboo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

const db = mongoose.connection;
db.once('open', () => console.log('Connected to mongodb'));
db.on('error', console.error.bind(console, 'connection error:'));


/* Middleware */
app.use(cors(corsOptions));
app.use(express.json({
  limit: '5000000'
}));

app.use(express.static('files'));

/* Database schemas & models */
const {
  candidateAccountModel,
  recruiterAccountModel,
  userAccountModel,
  announcesModel,
  companiesModel
} = require('./database/models');


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
app.get('/api/auth', basicTokenCheck, (req, res) => {
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
      newAccount = new recruiterAccountModel({ state: userState, firstName, lastName, email, password: cryptedPwd, prefixPhoneNumber, phoneNumber });
    else {
      const publicId = randomize('Aa0', 15);
      newAccount = new candidateAccountModel({ state: userState, firstName, lastName, email, password: cryptedPwd, prefixPhoneNumber, phoneNumber, publicId });
    }

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
app.get('/api/userInfo', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/picture', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/description', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/email', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/skills/add', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/skills/remove', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/skills/update', candidateTokenCheck, async (req, res) => {
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
app.put('/api/profil/:info', candidateTokenCheck, async(req, res) => {
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
app.get('/api/candidate/settings', candidateTokenCheck, async (req, res) => {
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




/*
  @route:   /api/recruiter/companies
  @method:  GET
*/
app.get('/api/recruiter/companies', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/companies (GET)');
  const { email } = req.body;

  try {
    const rdata = await recruiterAccountModel.find({ email }, { companies: 1 });
    if (rdata.length === 0) {
      res.status(401).send();
      return;
    }

    const companies = await companiesModel.find({ _id: { $in: rdata[0].companies }});
    console.log(companies);

    res.status(200).send(companies);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




/*
  @route:   /api/recruiter/companies
  @method:  POST
*/
app.post('/api/recruiter/companies', recruiterTokenCheck, async (req, res) => {
  const { email, data, userId } = req.body;

  try {
    // Check if company doesn't exist
    const checkCompany = await companiesModel.find({ name: data.name });
    if (checkCompany.length !== 0) {
      res.status(200).send({ state: 'already exist' });
      return;
    }

    // Check the recruiter account
    const recruiterData = await recruiterAccountModel.find({ email });
    if (recruiterData.length === 0) {
      res.status(401).send();
      return;
    }

    const newId = mongoose.Types.ObjectId();
    const userDirPath = __dirname + '/files/' + recruiterData[0]._id + '/' + newId;

    fs.mkdir(userDirPath, { recursive: true }, async function(err) {
      console.log(err);
      if (err === null || (err && err.code === 'EEXIST')) {
        // Format the data
        let logo64data = req.body.data.logo.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        let cover64data = req.body.data.cover.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');


        // Format the name
        const logoRd = randomize('Aa0', 15);
        const logoDbPicturePath = `/comp-logo-${logoRd}.${req.body.data.logo.type}`;
        const logoServPicturePath = userDirPath + logoDbPicturePath;

        // Format the name
        const coverRd = randomize('Aa0', 15);
        const coverDbPicturePath = `/comp-cover-${coverRd}.${req.body.data.cover.type}`;
        const coverServPicturePath = userDirPath + coverDbPicturePath;


        // Create the new img
        fs.writeFile(logoServPicturePath, logo64data, 'base64', async (e) => {
          if (e)
            throw e;
        });

        fs.writeFile(coverServPicturePath, cover64data, 'base64', async (e) => {
          if (e)
          throw e;
        });

        const coverPath = '/' + recruiterData[0]._id + '/' + newId + coverDbPicturePath;
        const logoPath = '/' + recruiterData[0]._id + '/' + newId +  logoDbPicturePath;


        // Store into 
        const company = new companiesModel({ ...data, _id: newId, logo: logoPath, cover: coverPath , employeesNumber: data.companyEmployeesNumber, createdBy: userId });
        const savedCompany = await company.save();

        const udata = await recruiterAccountModel.findOneAndUpdate({ email }, { $push: { companies: savedCompany._id }, updated: new Date() }, { new: true });
        if (udata !== null)
          res.status(200).send({ state: 'created' });
        else
          throw 'account error';
    
        return;
      }
      else
        throw 'syscall error';
    });

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});



app.delete('/api/recruiter/companies', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/companies (DELETE)');

  const { email, data, userId } = req.body;

  try {
    const udata = await recruiterAccountModel.findOneAndUpdate({ email }, { $pull: { companies: { _id: data._id }}}, { new: true });
    if (udata !== null) {
      fs.unlink(__dirname + '/files' + data.logo, (e) => {
        console.log(e)
        fs.unlink(__dirname + '/files' + data.cover, (e) => {
          console.log(e)
          fs.rmdir(__dirname + '/files/' + userId + '/' + data._id, e => console.log(e));
        });
      });

      res.status(200).send(udata.companies);
    }
    else
      res.status(404).send();

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.put('/api/recruiter/companies', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/companies (PUT)');
  const { email, data, userId } = req.body;

  try {

    // Check if the resource exist.
    const cdata = await recruiterAccountModel.find({ email, companies: { $elemMatch: data._id }}, { companies: 1 });
    console.log(cdata);
    if (cdata === null || cdata.length === 0) {
      res.status(404).send();
      return;
    }

    // Check if the name is available.
    const companyData = await companiesModel.find({ name: data.name });
    if (companyData.length === 1 && (companyData[0].createdBy.toString() !== userId.toString())) {
      res.status(200).send({ state: 'already exist'});
      return;
    }

    if (companyData.length === 0) {
      res.status(404).send();
      return;
    }


    // Update the company.
    // const companyData = cdata[0].companies.filter(item => item._id.toString() === data._id.toString());


    // Verify if logo changed
    const userDirPath = __dirname + '/files/' + cdata[0]._id + '/' + companyData[0]._id;
    fs.mkdir(userDirPath, { recursive: true }, async function(err) {
      console.log('mdkir err:', err);
      if (err === null || (err && err.code === 'EEXIST')) {

        let logoPath = companyData[0].logo;
        let coverPath = companyData[0].cover;

        if (typeof data.logo === 'object') {
          fs.unlink(__dirname + '/files' + companyData[0].logo, (e) => console.log(e));
          const logo64data = data.logo.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
          
          const logoRd = randomize('Aa0', 15);
          const logoDbPicturePath = `/comp-logo-${logoRd}.${data.logo.type}`;
          const logoServPicturePath = userDirPath + logoDbPicturePath;
          
          fs.writeFile(logoServPicturePath, logo64data, 'base64', async (e) => {
            if (e)
            throw e;
          });
          
          logoPath = '/' + cdata[0]._id + '/' + companyData[0]._id +  logoDbPicturePath;
          console.log('IN LOGO');
        }
        
        if (typeof data.cover === 'object') {
          fs.unlink(__dirname + '/files' + companyData[0].cover, (e) => console.log(e));
          const cover64data = data.cover.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
          
          const coverRd = randomize('Aa0', 15);
          const coverDbPicturePath = `/comp-cover-${coverRd}.${data.cover.type}`;
          const coverServPicturePath = userDirPath + coverDbPicturePath;
          
          fs.writeFile(coverServPicturePath, cover64data, 'base64', async (e) => {
            if (e)
            throw e;
          });
          
          coverPath = '/' + cdata[0]._id + '/' + companyData[0]._id + coverDbPicturePath;
        }


        // Store into 
        const udata = await companiesModel.findOneAndUpdate(
          { name: data.name },
          { $set: {
            "companies.$.logo": logoPath,
            "companies.$.cover": coverPath,
            "companies.$.description": data.description,
            "companies.$.name": data.name,
            "companies.$.email": data.email,
            "companies.$.phone": data.phone,
            "companies.$.address": data.address,
            "companies.$.country": data.country,
            "companies.$.employeesNumber": data.employeesNumber,
            "companies.$.activityArea": data.activityArea,
            "companies.$.link": data.link,
            "companies.$.NIF": data.NIF,
          }},
          { new: true }
        );

        if (udata !== null)
          res.status(200).send({ state: 'updated', data: udata.companies });
        else
          throw 'account error';
    
        return;
      }
      else
        throw 'syscall error';
    });

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.get('/api/recruiter/cards', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/cards (GET):');
  const { email } = req.body;

  try {
    const rdata = await recruiterAccountModel.find({ email }, { cards: 1 });
    console.log(rdata);

    if (rdata.length > 0) {
      res.status(200).send(rdata[0].cards);
      return;
    }
    else
      throw 'account error';
  } catch (e) {
    res.status(500).send();
  }
});




app.post('/api/recruiter/cards', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/cards (POST):');
  const { email, data } = req.body;

  try {
    const rdata = await recruiterAccountModel.find({ email, cards: { $elemMatch: { alias: data.alias }}});

    if (rdata.length === 0) {
      const sdata = await recruiterAccountModel.findOneAndUpdate({ email }, { $push: { cards: { ...data }}}, { new: true });

      if (sdata !== null)
        res.status(200).send({ state: 'created', data: sdata.cards });
      else
        throw 'account error';
    }
    else
      res.status(200).send({ state: 'alreadyExist' });

    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});



app.get('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (GET):');
  const { email, userId } = req.body;

  try {
    const adata = await recruiterAccountModel.find({ email }, { announces: 1 });
    if (adata.length === 0) {
      res.status(401).send();
      return;
    }

    if (adata[0].announces.length === 0) {
      res.status(200).send([]);
      return;
    }

    const announces = await announcesModel.aggregate([
      { $match: { _id: { $in: adata[0].announces }}},
      { $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'companyInfo'
      }}
    ]);

    res.status(200).send(announces);
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});





app.post('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (POST):');
  const {email, data} = req.body;
  console.log(data);

  try {
    const publicId = randomize('Aa0', 15);
    const newAnnounce = new announcesModel({ ...data, publicId, card: data.card._id, company: (data.company !== 'anonymous') ? data.company._id : null });
    const rdata = await newAnnounce.save();

    if (rdata === null)
      throw 'db error';

    const recData = await recruiterAccountModel.findOneAndUpdate({ email }, { $push: { announces: rdata._id }});
    if (recData === null) {
      res.status(401).send();
      return;
    }

    const announces = await announcesModel.aggregate([
      { $match: { _id: rdata._id }},
      { $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'companyInfo'
      }}
    ]);

    res.status(200).send(announces);

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.delete('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (DELETE):');
  const {email, data} = req.body;

  try {
    await recruiterAccountModel.findOneAndUpdate({ email }, { $pull: { announces: data._id } });
    const ddata = await announcesModel.deleteOne({ _id: data._id });

    if (ddata.deletedCount === 1)
      res.status(204).send();
    else
      res.status(404).send();

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.get('/api/recruiter/settings', recruiterTokenCheck, async (req, res) => {
  console.log('/api/recruiter/settings (GET):');
  const { email } = req.body;

  try {
    const settings = await recruiterAccountModel.find({ email }, { settings: 1 });
    if (settings.length === 0) {
      res.status(404).send();
      return;
    }

    res.status(200).send(settings[0].settings);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.put('/api/recruiter/settings', recruiterTokenCheck, async (req, res) => {
  console.log('/api/recruiter/settings (PUT):')
  const { email, data } = req.body;

  try {
    const settings = await recruiterAccountModel.findOneAndUpdate({ email }, { settings: data });
    if (settings === null) {
      res.status(404).send();
      return;
    }

    res.status(200).send();
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.get('/api/recruiter/cards', recruiterTokenCheck, async (req, res) => {
  console.log('/api/recruiter/cards (GET):');
  const { email } = req.body;

  try {
    const settings = await recruiterAccountModel.find({ email }, { cards: 1 });
    if (settings.length === 0) {
      res.status(404).send();
      return;
    }

    res.status(200).send(settings[0].cards);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})




app.delete('/api/recruiter/cards', recruiterTokenCheck, async (req, res) => {
  console.log('/api/recruiter/cards (DELETE):');
  const { email, data } = req.body;

  try {
    const rdata = await recruiterAccountModel.findOneAndUpdate({ email }, { $pull: { cards: { _id: data._id }}});
    console.log(rdata);
    if (rdata === null) {
      res.status(404).send();
      return;
    }

    res.status(204).send();
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.post('/api/jobs', async (req, res) => {
  console.log('/api/jobs (POST -> GET with params):');
  const { data } = req.body;
  console.log(data);

  let query = {};
  (data.search !== '') ? query.title = { $regex: data.search, $options: 'i' } : null;
  (data.triboo === '') ? query.triboo = { $in: ['commercial', 'tech', 'engineering', 'retail']} : query.triboo = data.triboo;
  (data.location.length !== 0) ? query.location = { $in: data.location } : null;

  const { internship, cdd, cdi, contractor } = data.contractsType;
  let contractArray = [];
  internship  ? contractArray.push('internship')  : null;
  cdd         ? contractArray.push('cdd')         : null;
  cdi         ? contractArray.push('cdi')         : null;
  contractor  ? contractArray.push('contractor')  : null;
  (contractArray.length !== 0) ? query.contractType = { $in: contractArray } : null;

  query['salary.min'] = { $gte: data.salary.min };
  query['salary.max'] = { $lte: data.salary.max };
  console.log(query);

  // const triboo = (data.triboo === '') ? { $in: ['commercial, tech, engineering, retail']} : data.triboo;

  try {
    // const announces = await announcesModel.find(query, null, { limit: 30, skip: data.offset });
    const count = await announcesModel.countDocuments(query);
    const announces = await announcesModel.aggregate([
      { $match: query },
      { $limit: 20 },
      { $skip: data.offset },
      { 
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyInfo'
        }
      }
    ]);

    console.log(count);

    let ann = [];
    if (announces.length > 0) {
      for (let i = 0; i < 5; i++)
        ann.push(announces[0]);
    }
    
    res.status(200).send({ count, announces: ann });
    // res.status(200).send({ count, announces });
  } catch (e) {
    console.log(e);
    res.status(500).send({ count: 0, announces: [] });
  }
});




app.get('/api/job/:publicId', async (req, res) => {
  console.log('/api/job/:publicId (GET)');
  const { publicId } = req.params;
  console.log(publicId);
  
  try {
    const announce = await announcesModel.aggregate([
      { $match: { publicId: publicId } },
      { 
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyInfo'
        }
      }
    ]);

    console.log(announce)

    if (announce.length === 0) {
      res.status(404).send();
      return;
    }

    res.status(200).send(announce[0]);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})




app.post('/api/companies', async (req, res) => {
  console.log('/api/companies (POST -> GET):');
  const { data } = req.body;

  let query = {};
  data.search !== '' ? query.name = { $regex: data.search, $options: 'i' } : null;
  data.triboo === '' ? query.activityArea = { $in: ['commercial', 'tech', 'engineering', 'retail'] } : query.activityArea = data.triboo;
  data.country.length > 0 ? query.country = { $in: data.country } : null;

  const { tiny, small, mid, big, huge } = data.size;
  let sizeArray = [];
  tiny  ? sizeArray.push('tiny')  : null;
  small ? sizeArray.push('small') : null;
  mid   ? sizeArray.push('mid')   : null;
  big   ? sizeArray.push('big')   : null;
  huge  ? sizeArray.push('huge')  : null;
  sizeArray.length !== 0 ? query.employeesNumber = { $in: sizeArray } : query.employeesNumber = { $in: ['tiny', 'small', 'mid', 'big','huge'] };

  try {
    const count = await companiesModel.countDocuments(query);
    const companies = await companiesModel.aggregate([
      { $match: query },
      { $limit: 24 },
      { $skip: data.offset },
      { 
        $lookup: {
          from: 'announces',
          localField: '_id',
          foreignField: 'company',
          as: 'announces'
        }
      },
      {
        $project: {
          _id: 1,
          logo: 1,
          cover: 1,
          description: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          country: 1,
          employeesNumber: 1,
          activityArea: 1,
          link: 1,
          NIF: 1,
          createdBy: 1,
          announcesNumber: { $size: "$announces" }
        }
      }
    ]);

    console.log(companies)
    res.status(200).send({ count, companies });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send({ count: 0, companies: [] });
  }
});




app.get('/api/company/:name', async (req, res) => {
  console.log('/api/company/:name (GET):');
  const { name } = req.params;

  try {
    const company = await companiesModel.aggregate([
      { $match: { name } },
      {
        $lookup: {
          from: 'announces',
          localField: '_id',
          foreignField: 'company',
          as: 'announces'
        }
      }
    ]);

    if (company.length === 0) {
      res.status(404).send();
      return;
    }

    res.status(200).send(company[0]);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.get('/api/candidate/:publicId', async (req, res) => {
  console.log('/api/candidate/:publicId (GET)');
  const { publicId } = req.params;

  try {
    const candidate = await candidateAccountModel.find({ publicId });
    if (candidate.length === 0) {
      res.status(404).send();
      return;
    }

    res.status(200).send(candidate[0]);
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})
// Run the server.
app.listen(port, () => console.log(`Server running on port:${port}`));