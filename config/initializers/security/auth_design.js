// config/initializers/security/auth_design.js
'use strict';

// Package
var config = require('nconf');
var CONST  = require('config/constants');
var logger = require('winston');
var oz_flow        = require('oz-core-express');
var BasicAuth      = require('oz-flow-basic-auth');
var ApiKey         = require('oz-flow-apikey');
var OAuth2Password = require('oz-flow-oauth2-password');
var Bearer         = require('oz-flow-bearer');
var rest           = require('libs/lib_rest');

// variable
var auth_model = require('app/models/auth_model');

// variable
var auth_setting = config.get('authSetting');

//
module.exports = {
  initialize: () => {
    // Normal Basic Auth Flow
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

    // Normal API Key Auth Flow
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
        throw 'API-Key Incorrect';
      }
    });

    // Normal OAuth2 Resource Owner Password Credentials Grant Flow
    var oauth2_password = new OAuth2Password({
      fieldName: 'authorization',
      scheme: 'Sunrise',
      fullScope: auth_setting.scope,
      clientIdValidator: /^[a-zA-Z\d]{32}$/,
      clientSecretValidator: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
      usernameValidator: /^[a-zA-Z\d\._@]{6,12}$/,
      passwordValidator: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    }, function(fetched_info, cb) {
      // this is the verify function (custom design)
      (async function() {
        // client auth (client_id / client_secret)
        var app_client_info = await auth_model.readAppClientInfo(fetched_info.client_id);
        if(!app_client_info || app_client_info.app_secret != fetched_info.client_secret) {
          throw {error: 'invalid_client', error_description: 'Client 認證失敗，如 Client 未知、沒送出 Client 認證、使用了 Server 不支援的認證方式。'};
        }
        if(false) {
          throw {error: 'unauthorized_client', error_description: 'Client 沒有被授權可以使用這種方法來取得 Authorization Code。'};
        }
        // resource owner auth (username / password)
        var user_account_info = await auth_model.readUserAccountInfo(fetched_info.username);
        if(!user_account_info || user_account_info.password != fetched_info.password) {
          throw {error: 'invalid_grant', error_description: '提出的 Grant 或是 Refresh Token 不正確、過期、被撤銷、Redirection URI 不符、不是給你這個 Client。'};
        } else if(user_account_info.suspend) {
          throw {error: 'invalid_grant', error_description: '提出的 Grant 或是 Refresh Token 不正確、過期、被撤銷、Redirection URI 不符、不是給你這個 Client。'};
        } else if(user_account_info.phone_status !== CONST.DB.PHONE_STATUS.PASS) {
          throw {error: 'invalid_grant', error_description: '提出的 Grant 或是 Refresh Token 不正確、過期、被撤銷、Redirection URI 不符、不是給你這個 Client。'};
        } else if(user_account_info.email_status !== CONST.DB.EMAIL_STATUS.PASS) {
          throw {error: 'invalid_grant', error_description: '提出的 Grant 或是 Refresh Token 不正確、過期、被撤銷、Redirection URI 不符、不是給你這個 Client。'};
        }
        // pass
        cb(null, {
          app_client_info: app_client_info,
          user_account_info: user_account_info,
        });
      })()
      .catch(err => {
        cb(err);
      });
    });

    // Customize Bearer Token Auth Flow
    var basic_bearer = new Bearer({
      fieldName: 'authorization',
      scheme: 'Sunrise',
      secret: auth_setting.jwt.SECRET,
      scope: ['basic'],
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

    // Customize Bearer Token Auth Flow
    var a_bearer = new Bearer({
      fieldName: 'authorization',
      scheme: 'Sunrise',
      secret: auth_setting.jwt.SECRET,
      scope: ['basic', 'role_a'],
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

    // Customize Bearer Token Auth Flow
    var b_bearer = new Bearer({
      fieldName: 'authorization',
      scheme: 'Sunrise',
      secret: auth_setting.jwt.SECRET,
      scope: ['basic', 'role_b'],
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
    oz_flow.load('sunrise_password', oauth2_password);
    oz_flow.load('sunrise_basic', basic_bearer);
    oz_flow.load('sunrise_a', a_bearer);
    oz_flow.load('sunrise_b', b_bearer);
  },

  basicAuth: () => {
    return oz_flow.authenticate('basic_auth', {
      header: 'headers',
      successRedirect: '/',
      failureRedirect: '/',
    }, function(req, res, next){
      if(req.oz_flow_output.err) {
        logger.debug(req.oz_flow_output);
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
        logger.debug(req.oz_flow_output);
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

  oauth2Password: () => {
    return oz_flow.authenticate('sunrise_password', {
      header: 'headers',
      body: 'body',
      successRedirect: '/',
      failureRedirect: '/',
    }, function(req, res, next){
      if(req.oz_flow_output.err) {
        switch(req.oz_flow_output.err.error) {
          case 'invalid_request':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.INVALID_REQUEST, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'invalid_client':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.INVALID_CLIENT, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'invalid_grant':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.INVALID_GRANT, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'unauthorized_client':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.UNAUTHORIZED_CLIENT, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'unsupported_grant_type':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.UNSUPPORTED_GRANT_TYPE, 
              header: req.oz_flow_output.header,
            });
            break;
          case 'invalid_scope':
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.REQUEST.AUTH.OAUTH2.REQ.INVALID_SCOPE, 
              header: req.oz_flow_output.header,
            });
            break;
          default:
            logger.debug(req.oz_flow_output);
            return rest.resError(req, res, {
              res_type: rest.res_codes.ERROR.BASIC.SERVER, 
            });
        }
      } else {
        if(req.oz_flow_output.header) {
          Object.keys(req.oz_flow_output.header).forEach(function(key) {
            res.header(key, req.oz_flow_output.header[key]);
          });
        }
        next();
      }
    });
  },

  bearer: (role) => {
    if(!role) throw 'bearer auth need `role` parameter.';

    return oz_flow.authenticate('sunrise_' + role, {
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
            logger.debug(req.oz_flow_output);
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