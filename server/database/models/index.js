const mongoose = require('mongoose');
const { basicAccountSchema, candidateAccountSchema, announceSchema } = require('../schemas');

const userAccountModel = mongoose.model('BasicUserAccount', basicAccountSchema, 'userAccount');

const candidateAccountModel = mongoose.model('CandidateAccount', candidateAccountSchema, 'userAccount');

const announceModel = mongoose.model('announce', announceSchema);

module.exports = { userAccountModel, candidateAccountModel, announceModel };