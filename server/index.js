const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const randomize = require('randomatic');
const app = express();
const { APP_URL, STRIPE_API } = require('./config');

const stripe = require('stripe')(STRIPE_API);

const { recruiterTokenCheck, candidateTokenCheck, basicTokenCheck } = require('./verification');

const { handleInputText, handleInputEmail, handleInputPhone } = require('./utils/input');

console.log(APP_URL);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwtSecret = "qkslfkjdsq123RESFRZ2sdsdf";

const port = 3001;

const cors = require('cors');
const corsOptions = {
  origin: APP_URL
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



const server = require('http').Server(app);
const io = require('socket.io')(server, {
  pingTimeout: 60000,
});
io.set('origins', '*:*');

// const MSG_NSP_SOCKET = io.of('/msg');
// let MSG_NSP = null;

// MSG_NSP.on('connection', socket => {
//   // MSG_NSP = socket;
//   // MSG_NSP.on()
// });


io.on('connection', (socket) => {
  console.log('connection');

  socket.on('join-room', roomId => {
    socket.join(roomId);
  });

  socket.on('leave-room', roomId => {
    socket.leave(roomId);
  })

  socket.on('join-inbox', inboxId => {
    socket.join(`inbox-${inboxId}`);
  });

  socket.on('leave-inbox', inboxId => {
    socket.leave(`inbox-${inboxId}`);
  });

  socket.on('message-received', async userId => {
    console.log('message-received event for: ', userId);
    try {
      await msgModel.updateMany({ to: mongoose.Types.ObjectId(userId), readed: false }, { readed: true });
    } catch (e) {
      console.log(e);
    }
  });
});

/* Database schemas & models */
const {
  newsletterModel,
  candidateAccountModel,
  recruiterAccountModel,
  userAccountModel,
  announcesModel,
  companiesModel,
  roomModel,
  msgModel,
  applyModel,
  couponModel
} = require('./database/models');

//
// app.get('/api/sample', async (req, res) => {
// });





app.post('/api/nws/subscription', async (req, res) => {
  const { email } = req.body;

  try {
    // NEED TO CHECK THE EMAIL FORMAT
    if (!handleInputEmail(email)) {
      res.status(200).send({ status: 'invalidFormat' });
      return;
    }

    const check = await newsletterModel.find({ email });
    if (check.length !== 0) {
      res.status(200).send({ status: 'alreadyExist' });
      return;
    }

    const nnws = new newsletterModel({ email });
    await nnws.save();

    res.status(200).send({ status: 'success' });
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


// "/api/auth" route check the validity of a token passed via authorization header.
app.get('/api/auth', basicTokenCheck, (req, res) => {
  console.log("==>   /api/auth   <==");

  if (req.body.email === undefined)
    return;

  const { email, userState, userId, isComplete } = req.body;
  res.status(200).send({ email, userState, userId, isComplete });
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
    @string firstname
    @string lastname
    @string email
    @string password
    @string prefixPhoneNumber
    @string phoneNumber
*/
app.post('/api/register', async (req, res) => {

  const { userState, firstname, lastname, email, phone, password } = req.body;

  console.log(userState, firstname, lastname, email, phone, password)

  /* Check the validity of the information received. */
  if (
    (userState !== 'candidate' && userState !== 'recruiter') ||
    !handleInputText(firstname) ||
    !handleInputText(lastname)  ||
    !handleInputEmail(email)    ||
    !handleInputPhone(phone)    ||
    !handleInputText(password)
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
      newAccount = new recruiterAccountModel({ state: userState, firstname, lastname, email, password: cryptedPwd, phone });
    else {
      const publicId = randomize('Aa0', 15);
      newAccount = new candidateAccountModel({ state: userState, firstname, lastname, email, password: cryptedPwd, phone, publicId });
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
  @route:  /api/candidate/info
  @method: GET
*/
app.get('/api/candidate/info', candidateTokenCheck, async (req, res) => {
  console.log("--> /api/userInfo <--");

  try {
    const data = await candidateAccountModel.find({ email: req.body.email }, { _id: 0, password: 0, creationDate: 0 });
    if (data.length === 0) {
      res.status(404).send();
      return;
    }

    const { state, firstname, lastname, email, phone, picture, description, job, birthdate, qualifications, experiences, skills, expertiseLevel, desiredContract, expectedSalary, legalAvailability, settings, publicId } = data[0];
    const formatedResult = { state, firstname, lastname, email, phone, picture, description, job, birthdate, skills, expertiseLevel, desiredContract, expectedSalary, legalAvailability, settings, publicId, qualifications: [...qualifications].reverse(), experiences: [...experiences].reverse() };
    res.status(200).send({ data: formatedResult });
  } catch (e) {
    console.log(e);
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
      console.log(err)
      if (err === null || (err && err.code === 'EEXIST')) {
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
// app.put('/api/profil/description', candidateTokenCheck, async (req, res) => {
//   console.log('\n--> /api/profil/description');
//   try {
//     const { description } = req.body;
//     const resData = await candidateAccountModel.updateOne({ email: req.body.email }, { description })
//     if (resData.n === 1 && resData.ok === 1)
//       res.status(200).send();
//     else
//       throw 'Update error';
//   } catch (e) {
//     console.log(e);
//     res.status(500).send();
//   }
// });




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
  console.log(req.data);

  try {
    console.log(email)
    const resData = await candidateAccountModel.updateOne({ email }, { [info]: data, updated: new Date() });
    console.log(resData);
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
  @route:   /api/candidate/qualification
  @method:  POST
  @summary: Add a qualification to candidate
*/
app.post('/api/candidate/qualification', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/qualification');
  const { email, data } = req.body;
  console.log(data);

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $push: { qualifications: { title: data.diplomaTitle, startingDate: data.startingDate, endDate: data.endDate, inProgress: data.inProgress, school: data.school }}},
      { new: true }
    );

    console.log(udata);

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(200).send(udata.qualifications[udata.qualifications.length - 1]);
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


/*
  @route:   /api/candidate/qualification
  @method:  PUT
  @summary: Remove a qualification from a candidate.
*/
app.put('/api/candidate/qualification', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/qualification (PUT)');
  const { email, id } = req.body;
  console.log(req.body);

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $pull: { qualifications: { _id: id }}}
    );

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(204).send();
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


/*
  @route:   /api/candidate/experience
  @method:  POST
  @summary: Add an experience to candidate
*/
app.post('/api/candidate/experience', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/experience');
  const { email, data } = req.body;
  console.log(data);

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $push: { experiences: { jobTitle: data.jobTitle, startingDate: data.startingDate, endDate: data.endDate, inProgress: data.inProgress, company: data.company, jobDescription: data.description }}},
      { new: true }
    );

    console.log(udata);

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(200).send(udata.experiences[udata.experiences.length - 1]);
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


/*
  @route:   /api/candidate/experience
  @method:  PUT
  @summary: Remove an experience from a candidate.
*/
app.put('/api/candidate/experience', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/experience (PUT)');
  const { email, id } = req.body;
  console.log(req.body);

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $pull: { experiences: { _id: id }}}
    );

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(204).send();
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/*
  @route:   /api/candidate/skill
  @method:  POST
  @summary: Add a skill to candidate
*/
app.post('/api/candidate/skill', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/skill');
  const { email, name } = req.body;

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $push: { skills: { name }}},
      { new: true }
    );

    console.log(udata);

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(200).send(udata.skills[udata.skills.length - 1]);
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


/*
  @route:   /api/candidate/skill
  @method:  PUT
  @summary: Remove a skill from a candidate.
*/
app.put('/api/candidate/skill', candidateTokenCheck, async (req, res) => {
  console.log('-> /api/candidate/skill (PUT)');
  const { email, id } = req.body;
  console.log(req.body);

  try {
    const udata = await candidateAccountModel.findOneAndUpdate(
      { email },
      { $pull: { skills: { _id: id }}}
    );

    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    res.status(204).send();
  }
  catch (e) {
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

  console.log(data);

  try {
    // Check if company doesn't exist
    const checkCompany = await companiesModel.find({ name: data.name });
    if (checkCompany.length !== 0) {
      res.status(401).send({ state: 'alreadyExist' });
      return;
    }

    // Check the recruiter account
    const recruiterData = await recruiterAccountModel.find({ email });
    if (recruiterData.length === 0) {
      res.status(401).send({ state: 'unauthorized' });
      return;
    }

    const newId = mongoose.Types.ObjectId();
    const userDirPath = __dirname + '/files/' + recruiterData[0]._id + '/' + newId;

    fs.mkdir(userDirPath, { recursive: true }, async function(err) {
      console.log(err);
      if (err === null || (err && err.code === 'EEXIST')) {
        // Format the data
        let logo64data = req.body.data.logo.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        // let cover64data = req.body.data.cover.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');


        // Format the name
        const logoRd = randomize('Aa0', 15);
        const logoDbPicturePath = `/comp-logo-${logoRd}.${req.body.data.logo.type}`;
        const logoServPicturePath = userDirPath + logoDbPicturePath;

        // Format the name
        // const coverRd = randomize('Aa0', 15);
        // const coverDbPicturePath = `/comp-cover-${coverRd}.${req.body.data.cover.type}`;
        // const coverServPicturePath = userDirPath + coverDbPicturePath;


        // Create the new img
        fs.writeFile(logoServPicturePath, logo64data, 'base64', async (e) => {
          if (e)
            throw e;
        });

        // fs.writeFile(coverServPicturePath, cover64data, 'base64', async (e) => {
        //   if (e)
        //   throw e;
        // });

        // const coverPath = '/' + recruiterData[0]._id + '/' + newId + coverDbPicturePath;
        const logoPath = '/' + recruiterData[0]._id + '/' + newId +  logoDbPicturePath;


        // Store into
        // const company = new companiesModel({ ...data, _id: newId, logo: logoPath, cover: coverPath , employeesNumber: data.companyEmployeesNumber, createdBy: userId });
        const company = new companiesModel({ ...data, _id: newId, logo: logoPath, createdBy: userId, formatedAddress: `${data.country} ${data.city}` });
        const savedCompany = await company.save();

        const udata = await recruiterAccountModel.findOneAndUpdate({ email }, { $push: { companies: savedCompany._id }, updated: new Date() }, { new: true });
        if (udata !== null)
          res.status(200).send(company);
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



app.delete('/api/recruiter/companies', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/companies (DELETE)');

  const { email, data: { logo, id }, userId } = req.body;

  try {
    // Find all the announce id that are attached to this company.
    const announcesAttached = await announcesModel.find({ company: id }, { _id: 1});
    let announces = [];
    announcesAttached.forEach(item => announces.push(item._id));


    // // unlink the logo
    const udata = await recruiterAccountModel.findOneAndUpdate({ email }, { $pull: { companies: id }, $pullAll: { announces }}, { new: true });
    console.log(udata);
    if (udata !== null) {
        fs.unlink(__dirname + '/files' + logo, (e) => {
            console.log(e)
            // fs.unlink(__dirname + '/files' + udata[0].cover, (e) => {
              //   console.log(e)
                fs.rmdir(__dirname + '/files/' + userId + '/' + id, e => console.log(e));
              // });
            });

      // remove the company and the announces
      await announcesModel.remove({ _id: { $in: announces }});
      await companiesModel.findOneAndDelete({ _id: id });

      res.status(204).send();
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
    const cdata = await recruiterAccountModel.find({ email, companies: { $elemMatch: { $in: [data._id] }}});
    if (cdata === null || cdata.length === 0) {
      res.status(404).send();
      return;
    }

    // Check if the name is available.
    const previousInfoCompany = await companiesModel.find({ _id: data._id });
    if (previousInfoCompany === null || previousInfoCompany.length === 0) {
      res.status(404).send();
      return;
    }


    /* Check if the name of the company is available. */
    const companyData = await companiesModel.find({ name: previousInfoCompany[0].name })
    if (companyData.length === 1 && companyData[0].createdBy.toString() !== userId.toString()) {
      res.status(401).send({ state: 'alreadyExist' });
      return;
    }


    // Update the company.
    // const companyData = cdata[0].companies.filter(item => item._id.toString() === data._id.toString());

    // Verify if logo changed
    const userDirPath = __dirname + '/files/' + cdata[0]._id + '/' + companyData[0]._id;
    fs.mkdir(userDirPath, { recursive: true }, async function(err) {
      // console.log('mdkir err:', err);

      if (err === null || (err && err.code === 'EEXIST')) {

        let logoPath = companyData[0].logo;
        // let coverPath = companyData[0].cover;

        if (data.logo.new) {
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
        }

        // if (typeof data.cover === 'object') {
        //   fs.unlink(__dirname + '/files' + companyData[0].cover, (e) => console.log(e));
        //   const cover64data = data.cover.data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

        //   const coverRd = randomize('Aa0', 15);
        //   const coverDbPicturePath = `/comp-cover-${coverRd}.${data.cover.type}`;
        //   const coverServPicturePath = userDirPath + coverDbPicturePath;

        //   fs.writeFile(coverServPicturePath, cover64data, 'base64', async (e) => {
        //     if (e)
        //     throw e;
        //   });

        //   coverPath = '/' + cdata[0]._id + '/' + companyData[0]._id + coverDbPicturePath;
        // }

        // Store into
        const udata = await companiesModel.findOneAndUpdate(
          { _id: data._id },
          { $set: {
            logo: logoPath,
            // "companies.$.cover": coverPath,
            description: data.description,
            name: data.name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            city: data.city,
            employeesNumber: data.employeesNumber,
            category: data.category,
            link: data.link,
            // "companies.$.NIF": data.NIF,
          }},
          { new: true }
        );

        if (udata !== null)
          res.status(200).send(udata);
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


// Send the announces of the recruiter.
app.get('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (GET):');
  const { email, userId } = req.body;

  try {
    const adata = await recruiterAccountModel.find({ email }, { announces: 1 });
    if (adata.length === 0) {
      res.status(401).send();
      return;
    }

    const announces = await announcesModel.aggregate([
      { $match: { _id: { $in: adata[0].announces }}},
      { $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'companyInfo'
      }},
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true }},
      { $unwind: { path: '$candidates', preserveNullAndEmptyArrays: true }},
      { $lookup: {
        from: 'userAccount',
        localField: 'candidates',
        foreignField: '_id',
        as: 'candidateInfo'
      }},
      { $unwind: { path: '$candidateInfo', preserveNullAndEmptyArrays: true }},
      { $group: {
        _id: '$_id',
        company: { $first: '$company' },
        benefits: { $first: '$benefits' },
        candidates: { $first: '$candidates' },
        title: { $first: '$title' },
        level: { $first: '$level' },
        country: { $first: '$country' },
        city: { $first: '$city' },
        street: { $first: '$street' },
        remote: { $first: '$remote' },
        postDescription: { $first: '$postDescription' },
        postResponsibilities: { $first: '$postResponsibilities' },
        profilDescription: { $first: '$profilDescription' },
        contractType: { $first: '$contractType' },
        salary: { $first: '$salary' },
        startingDate: { $first: '$startingDate' },
        visaSponsoring: { $first: '$visaSponsoring' },
        category: { $first: '$category' },
        publicId: { $first: '$publicId' },
        formatedAddress: { $first: '$formatedAddress' },
        candidateInfo: { "$push": "$candidateInfo" },
        companyInfo: { $first: '$companyInfo' }
      }}
    ]);

    console.log(announces);

    res.status(200).send(announces);
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




// Create an Intent and send a client-secret for the payement.
app.post('/api/recruiter/announce/intent', recruiterTokenCheck, async (req, res) => {
  try {
    const { coupon } = req.body;
    let amount = 15000;

    // check the coupon validity and action
    if (coupon !== null && coupon !== '') {
      const couponData = await couponModel.find({ name: coupon });
      if (couponData.length > 0 && couponData[0].validity)
        amount -= (couponData[0].reduc * 100);
      else {
        res.status(404).send();
        return;
      }
    }

    if (amount === 0 || amount < 0) {
      res.status(200).send({ clientSecret: null, amount: 0 });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({ amount, currency: 'eur' });

    res.status(200).send({ clientSecret: paymentIntent, amount: amount > 0 ? (amount / 100) : 0 });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


// app.post('/api/recruiter/announce/paymentMethod', recruiterTokenCheck, async (req, res) => {
//   try {
//     const paymentMethod = await stripe.paymentMethods.create(req.body.data);
//     console.log(paymentMethod);
//     res.status(200).send(paymentMethod);
//   }
//   catch (e) {
//     console.log(e);
//     res.status(500).send();
//   }
// });




app.post('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (POST):');
  const {email, data} = req.body;
  console.log(data);

  try {
    const publicId = randomize('Aa0', 15);
    const newAnnounce = new announcesModel({ ...data, publicId, company: (data.company !== 'anonymous') ? data.company : null, formatedAddress: `${data.country} ${data.city} ${data.street}` });
    const rdata = await newAnnounce.save();

    if (rdata === null)
      throw 'db error';

    const recData = await recruiterAccountModel.findOneAndUpdate({ email }, { $push: { announces: rdata._id }});
    if (recData === null) {
      res.status(401).send();
      return;
    }

    // const announces = await announcesModel.aggregate([
    //   { $match: { _id: rdata._id }},
    //   { $lookup: {
    //     from: 'companies',
    //     localField: 'company',
    //     foreignField: '_id',
    //     as: 'companyInfo'
    //   }}
    // ]);

    const announces = await announcesModel.aggregate([
      { $match: { _id: rdata._id }},
      { $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'companyInfo'
      }},
      { $unwind: { path: '$candidates', preserveNullAndEmptyArrays: true }},
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true }},
      { $lookup: {
        from: 'userAccount',
        localField: 'candidates',
        foreignField: '_id',
        as: 'candidateInfo'
      }},
    ]);

    console.log(announces);

    res.status(200).send(announces[0]);

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.delete('/api/recruiter/announces', recruiterTokenCheck, async (req, res) => {
  console.log('-> /api/recruiter/announces (DELETE):');
  const {email, id} = req.body;

  try {
    await recruiterAccountModel.findOneAndUpdate({ email }, { $pull: { announces: id } });
    const ddata = await announcesModel.deleteOne({ _id: id });

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



/***
 * Return the jobs matched for a particular query.
 * @param data Object:
 *  offset: number
 *  jobtitle: string | null
 *  location: string | null
 *  categories: Array<string>
 *  salaryMin: number
 *  contractsType: Array<string>
***/
app.post('/api/jobs', async (req, res) => {
  console.log('/api/jobs (POST -> GET with params):');
  const { offset, jobtitle, location, categories, salaryMin, contractsType } = req.body.data;

  let query = {};
  jobtitle !== null && jobtitle !== '' ? query.title           = { $regex: jobtitle, $options: 'i' } : null;
  location !== null && location !== '' ? query.formatedAddress = { $regex: location, $options: 'i' } : null;
  contractsType.length !== 0           ? query.contractType    = { $in: contractsType }              : null;
  categories.length !== 0              ? query.category        = { $in: categories }                 : null;
  query['salary.max']                                          = { $gte: parseInt(salaryMin) };

  try {
    console.log(query);
    const count = await announcesModel.countDocuments(query);
    const announces = await announcesModel.aggregate([
      { $match: query },
      { $limit: 20 },
      { $skip: offset },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyInfo'
        }
      },
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true }}
    ]);

    console.log(announces);

    res.status(200).send({ count, announces });
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send({ count: 0, announces: [] });
  }
});




app.get('/api/job/:publicId', async (req, res) => {
  console.log('/api/job/:publicId (GET)');
  const { publicId } = req.params;

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
  const { companyName, companyLocation, offset, size, categories } = req.body.data;

  let query = {};
  companyName !== '' && companyName !== null          ? query.name            = { $regex: companyName, $options: 'i' } : null;
  companyLocation !== '' && companyLocation !== null  ? query.formatedAddress = { $regex: companyLocation, $options: 'i' } : null;
  categories.length !== 0                             ? query.category        = { $in: categories } : null;
  size.length !== 0                                   ? query.employeesNumber = { $in: size } : null;

  try {
    const count = await companiesModel.countDocuments(query);
    const companies = await companiesModel.aggregate([
      { $match: query },
      { $limit: 24 },
      { $skip: offset },
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
          description: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          country: 1,
          city: 1,
          employeesNumber: 1,
          category: 1,
          link: 1,
          NIF: 1,
          createdBy: 1,
          announcesNumber: { $size: "$announces" }
        }
      }
    ]);

    console.log(companies)

    res.status(200).send({ count, data: companies });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send({ count: 0, data: [] });
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




app.get('/api/candidate/rooms', candidateTokenCheck, async (req, res) => {
  console.log('/api/candidate/rooms (GET):');
  const { userId } = req.body;

  try {
    const rooms = await roomModel.aggregate([
      { $match: { candidate: userId } },
      {
        $lookup: {
          from: 'userAccount',
          localField: 'candidate',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      {
        $lookup: {
          from: 'userAccount',
          localField: 'recruiter',
          foreignField: '_id',
          as: 'recruiterInfo'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo' },
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          accepted: 1,
          candidate: 1,
          recruiter: 1,
          lastMessageInfo: {
            _id: "$messagesInfo._id",
            from: "$messagesInfo.from",
            to: "$messagesInfo.to",
            readed: "$messagesInfo.readed",
            dateTime: "$messagesInfo.dateTime",
            content: "$messagesInfo.content",
            type: "$messagesInfo.type",
            apply: "$messagesInfo.apply"
          },
          candidateInfo: 1,
          recruiterInfo: 1
        }
      }
    ]);


    res.status(200).send(rooms);
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
});




app.post('/api/job/apply', candidateTokenCheck, async (req, res) => {
  console.log('/api/job/apply (POST):');

  const { jobId, userId } = req.body;

  console.log('** DATA APPLY **');
  console.log(req.body);

  try {
    const announce = await announcesModel.findOneAndUpdate({ _id: jobId }, { $push: { candidates: userId }});

    if (announce === null) {
      res.status(404).send();
      return;
    }

    res.status(204).send();
    return;
  }
  catch(e) {
    console.log(e)
    res.status(500).send();
    return;
  }
  //   const announce = await announcesModel.findOneAndUpdate({ _id: offerId }, { $push: { candidates: candidateId }}, { new: true });
  //   if (announce.length === 0) {
  //     res.status(404).send();
  //     return;
  //   }

  //   const apply = new applyModel({ candidateId, announceId: offerId, companyId });
  //   await apply.save();


  //   const recruiter = await recruiterAccountModel.find({ announces: offerId });
  //   if (recruiter.length === 0) {
  //     res.status(404).send();
  //     return;
  //   }

  //   const msg = new msgModel({
  //     from: candidateId,
  //     to: recruiter[0]._id,
  //     type: 'Application',
  //     apply: {
  //       candidateId,
  //       companyId,
  //       announceId: offerId
  //     }
  //   });
  //   const msgSaved = await msg.save();

  //   const checkRoom = await roomModel.find({ candidate: candidateId, recruiter: recruiter[0]._id });
  //   if (checkRoom.length === 0) {
  //     const room = new roomModel({ candidate: candidateId, recruiter: recruiter[0]._id });
  //     await room.save();
  //   }

  //   const uRoom = await roomModel.findOneAndUpdate({ candidate: candidateId, recruiter: recruiter[0]._id }, { $push: { messages: {  $each: [msgSaved._id], $position: 0 } }, lastMessage: msgSaved._id }, { new: true });
  //   res.status(200).send(announce);

  //   const nRoom = await roomModel.aggregate([
  //     { $match: { _id: mongoose.Types.ObjectId(uRoom._id) } },
  //     { 
  //       $lookup: {
  //         from: 'userAccount',
  //         localField: 'candidate',
  //         foreignField: '_id',
  //         as: 'candidateInfo'
  //       }
  //     },
  //     { 
  //       $lookup: {
  //         from: 'userAccount',
  //         localField: 'recruiter',
  //         foreignField: '_id',
  //         as: 'recruiterInfo'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'messages',
  //         localField: 'lastMessage',
  //         foreignField: '_id',
  //         as: 'messagesInfo'
  //       }
  //     },
  //     { $unwind: '$messagesInfo'},
  //     {
  //       $lookup: {
  //         from: 'companies',
  //         localField: 'messagesInfo.apply.companyId',
  //         foreignField: '_id',
  //         as: 'messagesInfo.apply.companyInfo'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'announces',
  //         localField: 'messagesInfo.apply.announceId',
  //         foreignField: '_id',
  //         as: 'messagesInfo.apply.announceInfo'
  //       }
  //     },
  //     {
  //       $project: {
  //         accepted: 1,
  //         candidate: 1,
  //         recruiter: 1,
  //         lastMessageInfo: {
  //           _id: "$messagesInfo._id",
  //           from: "$messagesInfo.from",
  //           to: "$messagesInfo.to",
  //           readed: "$messagesInfo.readed",
  //           dateTime: "$messagesInfo.dateTime",
  //           content: "$messagesInfo.content",
  //           type: "$messagesInfo.type",
  //           apply: "$messagesInfo.apply",
  //         },
  //         candidateInfo: 1,
  //         recruiterInfo: 1
  //       }
  //     }
  //   ]);

  //   io.sockets.in(`inbox-${recruiter[0]._id}`).emit('inbox', nRoom[0]);


  //   const appliedMsg = await msgModel.aggregate([
  //     { $match: { _id: mongoose.Types.ObjectId(msgSaved._id) } },
  //     {
  //       $lookup: {
  //         from: 'companies',
  //         localField: 'apply.companyId',
  //         foreignField: '_id',
  //         as: 'apply.companyInfo'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'announces',
  //         localField: 'apply.announceId',
  //         foreignField: '_id',
  //         as: 'apply.announceInfo'
  //       }
  //     },
  //     {
  //       $project: {
  //         from: 1,
  //         to: 1,
  //         readed: 1,
  //         dateTime: 1,
  //         content: 1,
  //         type: 1,
  //         apply: 1
  //       }
  //     }
  //   ]);

  //   console.log(appliedMsg);

  //   io.sockets.in(uRoom._id).emit('message', appliedMsg[0]);
  //   return;

  // } catch (e) {
  //   console.log(e);
  //   res.status(500).send();
  // }

});




app.get('/api/recruiter/rooms', recruiterTokenCheck, async (req, res) => {
  console.log('/api/recruiter/rooms (GET):');
  const { userId } = req.body;

  try {
    const rooms = await roomModel.aggregate([
      { $match: { recruiter: userId } },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'candidate',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'recruiter',
          foreignField: '_id',
          as: 'recruiterInfo'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo'},
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          accepted: 1,
          candidate: 1,
          recruiter: 1,
          lastMessageInfo: {
            _id: "$messagesInfo._id",
            from: "$messagesInfo.from",
            to: "$messagesInfo.to",
            readed: "$messagesInfo.readed",
            dateTime: "$messagesInfo.dateTime",
            content: "$messagesInfo.content",
            type: "$messagesInfo.type",
            apply: "$messagesInfo.apply"
          },
          candidateInfo: 1,
          recruiterInfo: 1
        }
      }
    ]);

    console.log(rooms);

    res.status(200).send(rooms);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});




app.get('/api/room/recruiter/:roomId/:offset', recruiterTokenCheck, async (req, res) => {
  console.log('/api/room/recruiter/:roomId/:offset (GET):');

  const { roomId, offset } = req.params;
  const { userId } = req.body;

  // console.log(roomId, offset);
  try {
    const msg = await roomModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(roomId) } },
      {
        $project: {
          "messagesArray": { $slice: ["$messages", parseInt(offset), 20] }
        }
      },
      { $unwind: '$messagesArray' },
      {
        $lookup: {
          from: 'messages',
          localField: 'messagesArray',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo'},
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          _id: "$messagesInfo._id",
          from: "$messagesInfo.from",
          to: "$messagesInfo.to",
          readed: "$messagesInfo.readed",
          dateTime: "$messagesInfo.dateTime",
          content: "$messagesInfo.content",
          type: "$messagesInfo.type",
          apply: "$messagesInfo.apply"
        }
      }
    ]);

    res.status(200).send(msg);

    // Mark recruiter msg as readed
    await msgModel.updateMany({ to: mongoose.Types.ObjectId(userId), readed: false }, { readed: true });

    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})




app.put('/api/room/recruiter/:roomId/accept', recruiterTokenCheck, async (req, res) => {
  console.log('/api/room/recruiter/:roomId/accept (PUT):')
  const { roomId } = req.params;
  
  try {
    const r = await roomModel.findOneAndUpdate({ _id: roomId }, { accepted: true });
    if (r === null) {
      res.status(404).send();
      return;
    }

    res.status(204).send();
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})




app.put('/api/room/recruiter/message', recruiterTokenCheck, async (req, res) => {
  console.log('/api/room/recruiter/message (PUT):');
  const { from, to, content, roomId } = req.body.data;

  try {
    const msg = new msgModel({ from, to, content });
    const msgSaved = await msg.save();
  
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId },
      { $push: { messages: { $each: [msgSaved._id], $position: 0 }}, lastMessage: msgSaved._id },
      { new: true }
    );

    if (room === null) {
      res.status(404).send();
      return;
    }


    io.sockets.in(roomId).emit('message', msgSaved);
    res.status(200).send(msgSaved);


    const nRoom = await roomModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(room._id) } },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'candidate',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'recruiter',
          foreignField: '_id',
          as: 'recruiterInfo'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo'},
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          accepted: 1,
          candidate: 1,
          recruiter: 1,
          lastMessageInfo: {
            _id: "$messagesInfo._id",
            from: "$messagesInfo.from",
            to: "$messagesInfo.to",
            readed: "$messagesInfo.readed",
            dateTime: "$messagesInfo.dateTime",
            content: "$messagesInfo.content",
            type: "$messagesInfo.type",
            apply: "$messagesInfo.apply",
          },
          candidateInfo: 1,
          recruiterInfo: 1
        }
      }
    ]);

    io.sockets.in(`inbox-${to}`).emit('inbox', nRoom[0]);
    return;

  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});



app.put('/api/room/candidate/message', candidateTokenCheck, async (req, res) => {
  console.log('/api/room/recruiter/message (PUT):');
  const { from, to, content, roomId } = req.body.data;

  try {
    const msg = new msgModel({ from, to, content });
    const msgSaved = await msg.save();
  
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId },
      { $push: { messages: { $each: [msgSaved._id], $position: 0 }}, lastMessage: msgSaved._id },
      { new: true }
    );

    if (room === null) {
      res.status(404).send();
      return;
    }

    io.sockets.in(roomId).emit('message', msgSaved);
    res.status(200).send(msgSaved);

    const nRoom = await roomModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(room._id) } },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'candidate',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      { 
        $lookup: {
          from: 'userAccount',
          localField: 'recruiter',
          foreignField: '_id',
          as: 'recruiterInfo'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo'},
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          accepted: 1,
          candidate: 1,
          recruiter: 1,
          lastMessageInfo: {
            _id: "$messagesInfo._id",
            from: "$messagesInfo.from",
            to: "$messagesInfo.to",
            readed: "$messagesInfo.readed",
            dateTime: "$messagesInfo.dateTime",
            content: "$messagesInfo.content",
            type: "$messagesInfo.type",
            apply: "$messagesInfo.apply",
          },
          candidateInfo: 1,
          recruiterInfo: 1
        }
      }
    ]);

    io.sockets.in(`inbox-${to}`).emit('inbox', nRoom[0]);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});





app.get('/api/room/candidate/:roomId/:offset', candidateTokenCheck, async (req, res) => {
  console.log('/api/room/candidate/:roomId/:offset (GET):');

  const { roomId, offset } = req.params;
  const { userId } = req.body;

  console.log(offset);


  try {
    const msg = await roomModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(roomId) } },
      {
        $project: {
          "messagesArray": { $slice: ["$messages", parseInt(offset), 20] }
        }
      },
      { $unwind: '$messagesArray' },
      {
        $lookup: {
          from: 'messages',
          localField: 'messagesArray',
          foreignField: '_id',
          as: 'messagesInfo'
        }
      },
      { $unwind: '$messagesInfo'},
      {
        $lookup: {
          from: 'companies',
          localField: 'messagesInfo.apply.companyId',
          foreignField: '_id',
          as: 'messagesInfo.apply.companyInfo'
        }
      },
      {
        $lookup: {
          from: 'announces',
          localField: 'messagesInfo.apply.announceId',
          foreignField: '_id',
          as: 'messagesInfo.apply.announceInfo'
        }
      },
      {
        $project: {
          _id: "$messagesInfo._id",
          from: "$messagesInfo.from",
          to: "$messagesInfo.to",
          readed: "$messagesInfo.readed",
          dateTime: "$messagesInfo.dateTime",
          content: "$messagesInfo.content",
          type: "$messagesInfo.type",
          apply: "$messagesInfo.apply"
        }
      }
    ]);

    // console.log(msg);
    res.status(200).send(msg);


    // Mark receivded message as readed.
    await msgModel.updateMany({ to: mongoose.Types.ObjectId(userId), readed: false }, { readed: true });

    return;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})




// Run the server.
server.listen(port, () => console.log(`Server running on port:${port}`));