const environment = process.env.NODE_ENV || 'development'
const config = require('./config');
const db = require('knex')(config.mysql[environment])

module.exports = db;



