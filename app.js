// /app.js
'use strict';

var Promise = require("bluebird");
var config  = require('nconf');
var logger  = require('winston');

// Load Environment variables from /.env file
require('dotenv').load();

// Set up configs
config.use('memory');
// First load command line arguments
config.argv();
// Load environment variables
config.env();
// Load config file for the environment
require('config/environments/' + config.get('NODE_ENV'));


// Initialize
logger.info('[APP] Starting server initialization');
var database_initializer = Promise.promisify(require('config/initializers/database/dbs_check'));
var server_starter = Promise.promisify(require('config/initializers/server'));
(async function() {
  try{
    await database_initializer(config.get('dbSetting').enabled);
    await server_starter();

    logger.info('[APP] initialized SUCCESSFULLY');
  } catch (err) {
    logger.error('[APP] initialization failed, reason:\n', err);
    process.exit(1);
  }
})();
