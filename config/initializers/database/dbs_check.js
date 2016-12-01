'use strict';

var logger  = require('winston');
var Promise = require("bluebird");

module.exports = function(db_list, cb) {
  logger.info('[DB] try to initialize database...');
  
  (async function() {
    for (var i = 0; i < db_list.length; i++) {
      await Promise.promisify(require('config/initializers/database/dbs/' + db_list[i]).connect)();
    }
  })()
  .then(data => {
    logger.info('[DB] initialized SUCCESSFULLY');
    cb(null);
  })
  .catch(err => {
    logger.error('[DB] necessary database connection failed.');
    return cb(err);
  });
};