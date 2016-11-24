// config/initializers/security/auth_design.js
'use strict';

// Package
var oz_flow   = require('oz-core-express');
var BasicAuth = require('oz-flow-basic-auth');
var ApiKey    = require('oz-flow-apikey');
var Bearer    = require('oz-flow-bearer');
var rest      = require('libs/lib_rest');

//
module.exports = {
  initialize: () => {
    var basic_auth = new BasicAuth({
      realm: 'CheCloud IoT API',
    }, function(fetched_info, cb) {
      // this is the verify function
      if(fetched_info.username == 'xman45' && fetched_info.password == 'Runningman7012') {
        // pass
        cb(null);
      } else {
        // auth failed
        throw 'error: username or password error';
      }
    });
    var apikey = new ApiKey({
      fieldName: 'authorization',
      scheme: 'Api-Key',
    }, function(fetched_info, cb) {
      // this is the verify function
      if(fetched_info.apikey == 'a_powerful_key') {
        // pass
        cb(null);
      } else {
        // auth failed
        throw 'error: apikey error';
      }
    });
    var bearer = new Bearer({
      fieldName: 'authorization',
      scheme: 'Sunrise',
      secret: 'kerker',
    }, function(fetched_info, cb) {
      // this is the verify function (custom design)
      if(true) {
        // pass
        cb(null);
      } else {
        // custom auth design failed
        throw {error: 'invalid_token', error_description: 'some reason'};
      }
    });

    oz_flow.load('basic_auth', basic_auth);
    oz_flow.load('apikey', apikey);
    oz_flow.load('sunrise', bearer);
  },

  basicAuth: () => {
    return oz_flow.authenticate('basic_auth', {
      header: 'headers',
      successRedirect: '/',
      failureRedirect: '/',
    }, function(req, res, next){
      if(req.oz_flow_output.err) {
        return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.REQUEST.AUTH.BASIC_AUTH, 
          header: req.oz_flow_output.header,
        });
      } else {
        next();
      }
    });
    // return oz_flow.authenticate('basic_auth', {
    //   successRedirect: '/',
    //   failureRedirect: '/',
    // });
  },

  apiKey: () => {
    return oz_flow.authenticate('apikey', {
      header: 'headers',
      body: 'body',
      query: 'query',
      successRedirect: '/',
      failureRedirect: '/',
    }, function(req, res, next){
      if(req.oz_flow_output.err) {
        return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.REQUEST.AUTH.API_KEY, 
          header: req.oz_flow_output.header,
        });
      } else {
        next();
      }
    });
    // return oz_flow.authenticate('basic_auth', {
    //   successRedirect: '/',
    //   failureRedirect: '/',
    // });
  },

  bearer: () => {
    return oz_flow.authenticate('sunrise', {
      header: 'headers',
      body: 'body',
      query: 'query',
      successRedirect: '/',
      failureRedirect: '/',
    }, function(req, res, next){
      if(req.oz_flow_output.err) {
        switch(req.oz_flow_output.err.error) {
          case 'invalid_request':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.RES.INVALID_REQUEST, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'invalid_token':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.RES.INVALID_TOKEN, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'insufficient_scope':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.RES.INSUFFICIENT_SCOPE, 
              header: req.oz_flow_output.header,
            });
            break;
          default:
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.BASIC.SERVER, 
            });
        }
      } else {
        next();
      }
    });
  },
}