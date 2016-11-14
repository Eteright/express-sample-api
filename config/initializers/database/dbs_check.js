'use strict';

var logger  = require('winston');

module.exports = function(db_list, cb) {
  logger.info('[DB] try to initialize database...');
    
  for (var i = 0; i < db_list.length; i++) {
    require('config/initializers/database/dbs/' + db_list[i]).connect((err)=>{
      if(err) {
        logger.error('[DB] necessary database connection failed.');
        cb(err);
      }
      logger.info('[DB] initialized SUCCESSFULLY');
      cb(null);
    });
  }
};