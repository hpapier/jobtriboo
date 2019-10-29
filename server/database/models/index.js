const mongoose = require('mongoose');
const { recruiterAccountSchema, candidateAccountSchema, basicAccountSchema } = require('../schemas');

const userAccountModel = mongoose.model('BasicUserAccount', basicAccountSchema, 'userAccount');

const recruiterAccountModel = mongoose.model('RecruiterAccount', recruiterAccountSchema, 'userAccount');

const candidateAccountModel = mongoose.model('CandidateAccount', candidateAccountSchema, 'userAccount');


module.exports = { userAccountModel, recruiterAccountModel, candidateAccountModel };