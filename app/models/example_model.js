// app/models/example_model.js
'use strict';

/**
 * Module dependencies.
 */
var base_model = require('app/models/core/mysql_model')
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
function ExampleModel(param, func) {
  // if (typeof param == 'function') {
  //     func = param;
  //     param = {};
  // }
  // if (!func) { throw new TypeError('Example Model requires a func callback'); }

  base_model.call(this);
  this.name = 'example';
}

/**
 * Inherit from `base_model`.
 */
util.inherits(ExampleModel, base_model);

/**
 * some description
 *
 * @param {Object} id the id column of test table
 * @api protected
 */
ExampleModel.prototype.foo = function(id) {
  if (!id) throw new Error('ExampleModel#foo need `id` parameter');

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

module.exports = new ExampleModel();
// we dont't need to expose constructor here, like
// exports.ExampleModel = ExampleModel;
