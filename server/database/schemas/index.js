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
  updated: { type: Date, default: new Date() },
  settings: {
    emailOnMsg: { type: Boolean, default: true }
  }
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

const companiesSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  cover: { type: String, default: '' },
  description: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  country: { type: String, default: '' },
  employeesNumber: { type: String, default: '' },
  activityArea: [String],
  link: { type: String, default: '' },
  NIF: { type: String, default: '' }
});


const cardSchema = new mongoose.Schema({
  alias: { type: String },
  number: { type: String },
  fullName: { type: String },
  month: { type: String },
  year: { type: String },
  CVC: { type: Number }
});


const recruiterDataSchema = new mongoose.Schema({
  companies: [companiesSchema],
  announces: [announceSchema],
  cards: [cardSchema]
});


const recruiterAccountSchema = new mongoose.Schema();
recruiterAccountSchema.add(basicAccountSchema).add(recruiterDataSchema);

module.exports = {
  recruiterAccountSchema,
  candidateAccountSchema,
  basicAccountSchema
}