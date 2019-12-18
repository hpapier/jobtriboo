const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  APP_URL: process.env.NODE_ENV ? process.env.APP_URL : 'http://localhost:3000',
  STRIPE_API: process.env.NODE_ENV ? process.env.STRIPE_DEV_API : process.env.STRIPE_PROD_API
}