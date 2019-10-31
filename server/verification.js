const { userAccountModel } = require('./database/models');
const jwt = require('jsonwebtoken');
const jwtSecret = "qkslfkjdsq123RESFRZ2sdsdf";

const tokenVerification = async (req, res) => {
  console.log("==> token verification <==");

  // Get the token passed via authorization header.
  const token = req.headers.authorization;
  
  // Check the token content and return 401 error if it's equal to null.
  if (token === null) {
    res.status(401).send();
    return;
  }
  
  // Verify the token.
  try {
    const data = jwt.verify(token, jwtSecret);
    const udata = await userAccountModel.find({ email: data.email }, { state: 1 });
    if (udata.length === 0) {
      res.status(401).send();
      return;
    }

    req.body.email = data.email;
    req.body.userState = udata[0].state;
    req.body.userId = udata[0]._id;
  } catch (e) {
    console.log(e);
    res.status(401).send();
    return;
  }
}

const recruiterTokenCheck = async (req, res, next) => {
  await tokenVerification(req, res);
  const { userState } = req.body;

  if (userState !== 'recruiter') {
    res.status(401).send();
    return;
  }
  else
    next();
}

const candidateTokenCheck = async (req, res, next) => {
  await tokenVerification(req, res);
  const { userState } = req.body;

  if (userState !== 'candidate') {
    res.status(401).send();
    return;
  }
  else
    next();
}

const basicTokenCheck = async (req, res, next) => {
  await tokenVerification(req, res);
  next();
}

module.exports = {
  recruiterTokenCheck,
  candidateTokenCheck,
  basicTokenCheck
};