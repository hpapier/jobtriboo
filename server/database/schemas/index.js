const mongoose = require('mongoose');

const basicAccountSchema = new mongoose.Schema({
  state: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  prefixPhoneNumber: String,
  phoneNumber: String,
  creationDate: { type: Date, default: new Date() }
});

const accountInformationSchema = new mongoose.Schema({
  picture: { type: String, default: '' },
  description: { type: String, default: '' },
  country: { type: String, default: '' },
  age: { type: Number, default: 18 },
  triboo: { type: String, default: 'commercial' },
  jobName: { type: String, default: '' },
  skills: {
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      name: String,
      xp: Number
    }],
    default: []
  },
  studyLvl: { type: String, default: 'selflearner' },
  cv: { type: String, default: '' },
  desiredContract: { type: String, default: 'indifferent' },
  salaryExpected: { type: String, default: 'littleDignity' },
  availability: { type: String, default: 'now' },
  updated: { type: Date, default: new Date() }
});

const candidateAccountSchema = new mongoose.Schema();
candidateAccountSchema.add(basicAccountSchema).add(accountInformationSchema);


const announceSchema = new mongoose.Schema({
  company: String,
  salary: { min: Number, max: Number },
  title: String,
  triboo: String,
  publicId: Number
});


module.exports = {
  basicAccountSchema,
  accountInformationSchema,
  candidateAccountSchema,
  announceSchema
}