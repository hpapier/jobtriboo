const mongoose = require('mongoose');


const basicAccountSchema = new mongoose.Schema({
  state: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  phone: String,
  creationDate: { type: Date, default: new Date() }
});


const accountInformationSchema = new mongoose.Schema({
  picture:      { type: String, default: '' },
  description:  { type: String, default: '' },
  birthdate:    { type: String, default: '' },

  qualifications: {
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      title: String,
      startingDate: String,
      endDate: { type: String, default: '' },
      inProgress: Boolean,
      school: String
    }],
    default: []
  },

  experiences: {
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      jobTitle: String,
      startingDate: String,
      endDate: { type: String, default: '' },
      inProgress: Boolean,
      company: String,
      jobDescription: String
    }],
    default: []
  },

  skills: {
    type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      name: String,
    }],
    default: []
  },

  job:                { type: String, default: '' },
  expertiseLevel:     { type: String, default: '' },
  desiredContract:    { type: String, default: '' },
  legalAvailability:  { type: String, default: '' },
  expectedSalary:     { type: String, default: '' },

  updated:            { type: Date, default: new Date() },

  settings: {
    emailOnMsg: { type: Boolean, default: true }
  },

  publicId: String,
});


const candidateAccountSchema = new mongoose.Schema();
candidateAccountSchema.add(basicAccountSchema).add(accountInformationSchema);


const announceSchema = new mongoose.Schema({
  title: String,
  level: String,
  company: { type: mongoose.Types.ObjectId, default: null },
  country: String,
  city: String,
  street: String,
  formatedAddress: String,
  remote: Boolean,
  postDescription: String,
  postResponsibilities: String,
  profilDescription: String,
  contractType: String,
  salary: { min: Number, max: Number },
  startingDate: String,
  visaSponsoring: Boolean,
  category: String,
  benefits: [String],
  publicId: String,
  candidates: [mongoose.Types.ObjectId]
});


const companiesSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  // cover: { type: String, default: '' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  description: { type: String, default: '' },
  category: String,
  employeesNumber: { type: String, default: '' },
  formatedAddress: { type: String, default: '' },
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


const couponSchema = new mongoose.Schema({
  name: String,
  reduc: Number,
  validity: Boolean
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
  applySchema,
  couponSchema
}