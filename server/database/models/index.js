const mongoose = require('mongoose');
const {
  recruiterAccountSchema,
  candidateAccountSchema,
  basicAccountSchema,
  announceSchema,
  companiesSchema,
  roomSchema,
  msgSchema,
  applySchema
} = require('../schemas');

const userAccountModel = mongoose.model('BasicUserAccount', basicAccountSchema, 'userAccount');

const recruiterAccountModel = mongoose.model('RecruiterAccount', recruiterAccountSchema, 'userAccount');

const candidateAccountModel = mongoose.model('CandidateAccount', candidateAccountSchema, 'userAccount');

const announcesModel = mongoose.model('AnnounceModel', announceSchema, 'announces');

const companiesModel = mongoose.model('Companies', companiesSchema, 'companies')

const roomModel = mongoose.model('Room', roomSchema, 'rooms');

const msgModel = mongoose.model('Message', msgSchema, 'messages');

const applyModel = mongoose.model('Apply', applySchema, 'apply');

module.exports = { 
  userAccountModel,
  recruiterAccountModel,
  candidateAccountModel,
  announcesModel,
  companiesModel,
  roomModel,
  msgModel,
  applyModel
};