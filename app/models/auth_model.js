// app/models/auth_model.js
'use strict';

/**
 * Module dependencies.
 */
var BaseModel = require('app/models/core/mysql_model')
  , util = require('util')
  , logger = require('winston')
  , moment = require('moment');


/**
 * Creates an instance of `MysqlModel`.
 *
 * <some descriptions for using here>
 *
 * <ParameterName>:
 *
 *   - `<property>`  <description>
 *   - `<property>`  <description>
 *
 * Examples:
 *
 *     <example block>
 *
 * reference description here
 *
 * @constructor
 * @param {Object} [param]
 * @param {Function} func
 * @api public
 */
function AuthModel(param, func) {
  // if (typeof param == 'function') {
  //     func = param;
  //     param = {};
  // }
  // if (!func) { throw new TypeError('Auth Model requires a func callback'); }

  BaseModel.call(this);
  this.name = 'auth';
}

/**
 * Inherit from `BaseModel`.
 */
util.inherits(AuthModel, BaseModel);

/**
 * some description
 *
 * @param {Object} id the id column of test table
 * @api protected
 */
AuthModel.prototype.foo = function(id) {
  if (!id) throw new Error('AuthModel#foo need `id` parameter');

  return this.db.query(`
    SELECT
      *
    FROM
      \`test\` AS t
    WHERE
      t.\`id\` = ?
  `, { 
    replacements: [
      id
    ],
    type: this.db.QueryTypes.SELECT
  })
  .then(function(result) {
    logger.debug("result: ", result);
    return result.length > 0 ? result[0] : null;
  });
}

module.exports = new AuthModel();
// we dont't need to expose constructor here, like
// exports.AuthModel = AuthModel;
