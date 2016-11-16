'use strict';

// Package

// Variable
const response_codes = require('config/interface/response/res_codes');

// Main Export
var rest = {
  res_codes: response_codes,
  'resError': function(req, res, response_data) {//res_type, error_description, ext_data, plurals
    if (typeof response_data.ext_data === 'undefined') {
      response_data.ext_data = {};
    }
    var response_obj = {};
    var meta_data = {
      meta: {
        code: response_data.res_type.meta_code,
        error_type: req.t(response_data.res_type.error_type, response_data.plurals),
        error_description: req.t(response_data.error_description ? 
          response_data.error_description : response_data.res_type.default_error_description, 
          response_data.plurals)
      }
    };
    response_obj = Object.assign(response_obj, meta_data, response_data.ext_data);
    return res.status(response_data.res_type.http_code).json(response_obj);
  },
  'resSuccess': function(req, res, response_data) {//res_type, ext_data, plurals
    if (typeof response_data.ext_data === 'undefined') {
      response_data.ext_data = {};
    }
    var response_obj = {};
    var meta_data = {
      meta: {
        code: 200,
        message: req.t(response_data.res_type.message, response_data.plurals),
      }
    };
    response_obj = Object.assign(response_obj, meta_data, response_data.ext_data);
    return res.status(200).json(response_obj);
  },
}

module.exports = rest;
