// app/controllers/auth.js
'use strict';

// Package
var config      = require('nconf');
var CONST       = require('config/constants');
var RateLimit   = require('express-rate-limit');
var util        = require('util');
var logger      = require('winston');
var auth_design = require('config/initializers/security/auth_design');
var jwt         = require('jsonwebtoken');
var validate    = require('express-jsonschema').validate;
var rest        = require('libs/lib_rest');

// Models
var auth_model = require('app/models/auth_model');

// variables
var body_jsonschema = require('config/interface/request/body_schemas_json');
var query_schema    = require('config/interface/request/query_schemas');
var req_scope       = require('config/interface/request/req_scopes');
var rest_codes      = rest.res_codes;

module.exports = function(router) {
  // variables
  var rate_limit = config.get('securitySetting').rateLimit;
  rate_limit.handler = function(req, res/*, next*/) {
    rest.resError(req, res, {
      res_type: rest.res_codes.ERROR.REQUEST.RATE_LIMIT, 
      plurals: {ip: req.ip},
    });
  };
  var auth_setting = config.get('authSetting');

  // middleware across whole router
  router.use(new RateLimit(rate_limit));

  // This will handle the url calls for /example/resource_representation/action
  router.route('/access_token')
  .post(
    auth_design.oauth2Password(),
    serialize,
    function(req, res) {
      var token = generateToken('Sunrise', auth_setting.jwt.SECRET, auth_setting.jwt.TOKENTIME, {
        scope: req.oz_flow_output.scope,
      });
      return rest.resSuccess(req, res, {
        res_type: rest_codes.SUCCESS.BASIC.API_CALL, 
        ext_data: token
      });
    },
    function (req, res) {
    }
  );

  function serialize(req, res, next) {
    // 1. Create users, which are authenticated, but not in your database. This only happens if you use passport strategies for external services, like the Google or Facebook login (if someone authenticates with their google account they may have never been on your service and use it for the first time).
    // 2. Update the user data: Like #1, but now updates an already known user (a Facebook user could have switched his name in Facebook, you may want to update this in here too). 
    // 3. Complete the user data in your req.user object: If you need additional information which aren't inside the authentication process, you can store it req.users (and therefore in your token) in here.
    (async function() {
      // var foo1 = await example_model.createRow('test', {
      //   value: "x",
      // });
      // if(!foo1) return rest.resError(req, res, {
      //   res_type: rest.res_codes.ERROR.BASIC.SERVER, 
      // });

      // var foo2 = await example_model.createRow('test', {
      //   value: "y",
      // });
      // if(!foo2) return rest.resError(req, res, {
      //   res_type: rest.res_codes.ERROR.BASIC.SERVER, 
      // });

      // req.foo1 = foo1;
      // req.foo2 = foo2;
      next();
    })();
  }

  function generateToken(token_type, token_secret, lifetime, payload) {
    var token = {};
    token.access_token = jwt.sign(payload, token_secret, {
      expiresIn: lifetime
    });
    token.token_type = token_type;
    token.expires_in = lifetime;
    token.scope      = payload.scope;
    // token.refresh_token = null;
    return token;
  }

  // Error Handler
  router.use(function(err, req, res, next) {
    switch(err.name) {
      case 'JsonSchemaValidation':
        rest.resError(req, res, {
          res_type: rest_codes.ERROR.REQUEST.PARAMETER, 
          ext_data: {ref: err.validations}
        });
        break;
      default:
        logger.debug(err);
        rest.resError(req, res, {
          res_type: res_codes.ERROR.BASIC.SERVER, 
          ext_data: {ref: err},
        });
    }
  });
};