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

  // This will handle the url calls for /auth/access_token
  router.route('/access_token')
  .post(
    auth_design.oauth2Password(),
    // 因為 OAuth2 的參數錯誤有標準的錯誤回應，所以我們自己的參數錯誤要放在後面檢查
    validate({body: body_jsonschema.AuthAccessTokenPostSchema}), 
    serialize,
    function(req, res) {
      (async function() {
        // var scopes = await auth_model.XXXXX(req.serialize.client_id);
        var token = generateToken('Sunrise', auth_setting.jwt.SECRET, auth_setting.jwt.TOKENTIME, {
          client_id: req.serialize.client_id,
          client_device_id: req.serialize.client_device_id,
          client_device_code: req.body.device_code,
          app_code: req.oz_flow_output.client_id, /*app_code*/
          app_version: req.body.app_version,
          user_id: req.oz_flow_output.verify_info.user_account_info.user_id,
          scope: ['basic', 'role_app'],
        });
        return rest.resSuccess(req, res, {
          res_type: rest_codes.SUCCESS.BASIC.API_CALL, 
          ext_data: token
        });
      })();
    }
  );

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
          res_type: rest_codes.ERROR.BASIC.SERVER, 
          ext_data: {ref: err},
        });
    }
  });

  function serialize(req, res, next) {
    // 1. Create users, which are authenticated, but not in your database. This only happens if you use passport strategies for external services, like the Google or Facebook login (if someone authenticates with their google account they may have never been on your service and use it for the first time).
    // 2. Update the user data: Like #1, but now updates an already known user (a Facebook user could have switched his name in Facebook, you may want to update this in here too). 
    // 3. Complete the user data in your req.user object: If you need additional information which aren't inside the authentication process, you can store it req.users (and therefore in your token) in here.
    (async function() {
      var client_device_id = await auth_model.createClientDevice(req.body.device_code);
      if(!client_device_id) throw 'CreateClientDeviceException';

      var client_info = await auth_model.readClientInfo(
        client_device_id, 
        req.oz_flow_output.client_id, /*app_code*/
        req.oz_flow_output.verify_info.user_account_info.user_id
      );
      if (!client_info) {
        var client_id = await auth_model.createClient(
          client_device_id, 
          req.oz_flow_output.client_id, /*app_code*/
          req.body.app_version, 
          req.oz_flow_output.verify_info.user_account_info.user_id
        );
        if (client_id) {
          var client_id_for_auth = auth_model.createClientAuth(client_id);
          if(!client_id_for_auth) throw 'CreateClientAuthException';
        } else {
          if(!client_device_id) throw 'CreateClientException';
        }
      } else {
        client_id = client_info.client_id;
      }

      req.serialize = {
        client_device_id: client_device_id,
        client_id: client_id,
      };
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
};