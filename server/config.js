const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  APP_URL: process.env.NODE_ENV ? process.env.APP_URL : 'http://localhost:3000',
}