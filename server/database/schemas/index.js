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
  },
  publicId: String
});


const candidateAccountSchema = new mongoose.Schema();
candidateAccountSchema.add(basicAccountSchema).add(accountInformationSchema);


const announceSchema = new mongoose.Schema({
  company: { type: mongoose.Types.ObjectId, default: null },
  salary: { min: Number, max: Number },
  title: String,
  location: String,
  level: String,
  description: String,
  contractType: String,
  benefits: [String],
  card: mongoose.Types.ObjectId,
  sponsoring: Boolean,
  startingDate: Date,
  triboo: String,
  publicId: String,
  candidates: [mongoose.Types.ObjectId]
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
  NIF: { type: String, default: '' },
  createdBy: mongoose.Types.ObjectId
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
  companies: [mongoose.Types.ObjectId],
  announces: [mongoose.Types.ObjectId],
  cards: [cardSchema],
  settings: {
    emailOnMsg: { type: Boolean, default: true }
  }
});


const msgSchema = new mongoose.Schema({
  from: mongoose.Types.ObjectId,
  to: mongoose.Types.ObjectId,
  readed: { type: Boolean, default: false },
  dateTime: { type: Date, default: new Date() },
  content: { type: String, default: '' },
  type: { type: String, default: 'Message' },
  apply: {
    candidateId: { type: mongoose.Types.ObjectId, default: null },
    companyId: { type: mongoose.Types.ObjectId, default: null },
    announceId: { type: mongoose.Types.ObjectId, default: null },
    date: { type: Date, default: new Date() }
  }
});


const roomSchema = new mongoose.Schema({
  candidate: mongoose.Types.ObjectId,
  recruiter: mongoose.Types.ObjectId,
  accepted: { type: Boolean, default: false },
  lastMessage: { type: mongoose.Types.ObjectId, default: null },
  messages: [mongoose.Types.ObjectId]
});


const applySchema = new mongoose.Schema({
  candidateId: mongoose.Types.ObjectId,
  companyId: mongoose.Types.ObjectId,
  announceId: mongoose.Types.ObjectId,
  date: { type: Date, default: new Date() }
});


const recruiterAccountSchema = new mongoose.Schema();
recruiterAccountSchema.add(basicAccountSchema).add(recruiterDataSchema);


const newsletterSchema = new mongoose.Schema({
  email: String
});


module.exports = {
  newsletterSchema,
  recruiterAccountSchema,
  candidateAccountSchema,
  basicAccountSchema,
  announceSchema,
  companiesSchema,
  roomSchema,
  msgSchema,
  applySchema
}