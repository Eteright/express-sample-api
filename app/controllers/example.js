// app/controllers/auth.js
'use strict';

// Package
var config      = require('nconf');
var CONST       = require('config/constants');
var RateLimit   = require('express-rate-limit');
var util        = require('util');
var logger      = require('winston');
var auth_design = require('config/initializers/security/auth_design');
var validate    = require('express-jsonschema').validate;
var rest        = require('libs/lib_rest');

// Models
var example_model = require('app/models/example_model');

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

  // middleware across whole router
  router.use(new RateLimit(rate_limit));
  // router.use(auth_design.basicAuth());
  // router.use(auth_design.apiKey());
  router.use(auth_design.bearer());

  // This will handle the url calls for /example/resource_representation
  router.route('/resource_representation')
  .get(
    function(req, res, next) {
      logger.debug('client lang: ' + req.language);
      req.checkQuery(query_schema.ExampleResourceRepresentationGet);
      var error = req.validationErrors();
      if (error) {
        return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.REQUEST.PARAMETER, 
          ext_data: {ref: util.inspect(error)}, 
        });
      }
      next();
    },
    function(req, res, next) {
      (async function() {
        var foo1 = await example_model.foo(1);
        if(!foo1) return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.BASIC.SERVER, 
        });

        var foo2 = await example_model.foo(2);
        if(!foo2) return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.BASIC.SERVER, 
        });

        req.foo1 = foo1;
        req.foo2 = foo2;
        next();
      })();
    },
    function (req, res) {
      return rest.resSuccess(req, res, {
        res_type: rest_codes.SUCCESS.BASIC.API_CALL, 
        ext_data: {
          foo1: req.foo1,
          foo2: req.foo2,
          magic_number: CONST.TYPE_1.MAGIC_1,
          extended_info_name: req.t('APPLE'),
        },
      });
    }
  );

  // This will handle the url calls for /example/resource_representation/action
  router.route('/resource_representation/action')
  .post(
    validate({body: body_jsonschema.ExampleResourceRepresentationPost}),
    function(req, res, next) {
      (async function() {
        var foo1 = await example_model.createRow('test', {
          value: "x",
        });
        if(!foo1) return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.BASIC.SERVER, 
        });

        var foo2 = await example_model.createRow('test', {
          value: "y",
        });
        if(!foo2) return rest.resError(req, res, {
          res_type: rest.res_codes.ERROR.BASIC.SERVER, 
        });

        req.foo1 = foo1;
        req.foo2 = foo2;
        next();
      })();
    },
    function (req, res) {
      return rest.resSuccess(req, res, {
        res_type: rest_codes.SUCCESS.BASIC.API_CALL, 
        ext_data: {
          foo1: req.foo1,
          foo2: req.foo2,
          extended_info_name: "additional information",
        }
      });
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
          res_type: rest.res_codes.ERROR.BASIC.SERVER, 
          ext_data: {ref: err},
        });
    }
  });
};