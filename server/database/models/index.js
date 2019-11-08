const mongoose = require('mongoose');
const { recruiterAccountSchema, candidateAccountSchema, basicAccountSchema, announceSchema, companiesSchema } = require('../schemas');

const userAccountModel = mongoose.model('BasicUserAccount', basicAccountSchema, 'userAccount');

const recruiterAccountModel = mongoose.model('RecruiterAccount', recruiterAccountSchema, 'userAccount');

const candidateAccountModel = mongoose.model('CandidateAccount', candidateAccountSchema, 'userAccount');

const announcesModel = mongoose.model('AnnounceModel', announceSchema, 'announces');

const companiesModel = mongoose.model('Companies', companiesSchema, 'companies')

module.exports = { userAccountModel, recruiterAccountModel, candidateAccountModel, announcesModel, companiesModel };