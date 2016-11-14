'use strict';

var nconf     = require('nconf');
var logger    = require('winston');
var Sequelize = require('sequelize');

var instance = {
  client: null,
  connect: function(cb) {
    var setting = nconf.get('dbSetting').mysql;
    instance.client = new Sequelize(setting.database, setting.username, setting.password, {
      dialect: 'mysql',
      host: setting.hostname,
      port: setting.port,

      // logging: false,

      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },

      timezone: '+08:00'
    });

    instance.client
    .authenticate()
    .then(function(err) {
      logger.info('[DB] MySQL connection has been established successfully.');
      cb(null);
    })
    .catch(function (err) {
      logger.error('[DB] Unable to connect to the MySQL database.');
      cb(err);
    });
  },
}

module.exports = instance;