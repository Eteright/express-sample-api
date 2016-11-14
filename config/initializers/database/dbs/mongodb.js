'use strict';

var nconf = require('nconf');
var mongo = require('mongoose');

module.exports = function(cb) {
  var setting = nconf.get('dbSetting').mongodb;
  mongo.connect('mongodb://' + setting.hostname + '/' + setting.database, (err) => {
    if(err) cb(err);
    cb(null);
	});
};