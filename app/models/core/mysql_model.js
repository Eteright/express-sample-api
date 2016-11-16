// app/models/_model.js
'use strict';

/**
 * Module dependencies.
 */
var logger = require('winston')
    , moment = require('moment');

/**
 * Creates an instance of `MysqlModel`.
 *
 * @constructor
 * @api public
 */
function MysqlModel() {
  // Database
  this.db = require('config/initializers/database/dbs/mysql').client;
}

/**
 * createRow request.
 *
 * description
 *
 * @param {Object} table_name the target mysql table name.
 * @param {Object} data key-value pairs object in format {column_name: value, ...}.
 * @api public
 */
MysqlModel.prototype.createRow = function(table_name, data) {
  if (!table_name || typeof data !== 'object') 
    throw new Error('MysqlModel#createRow need `table_name` and `data` object');

  var q = "";
  var q_value = "";
  var q_replace = [];

  var keys = Object.keys(data);
  for (var i in keys) {
    if(data[keys[i]]) {
      q += ', `' + keys[i] + '`';
      q_value += ', ?';
      q_replace.push(data[keys[i]]);
    }
  }
  if(q_replace.length === 0) return false;
  q = q.substring(2);
  q_value = q_value.substring(2);

  return this.db.query(`
    INSERT INTO 
      \`` + table_name + `\`
    (
  ` + q + `
    ) VALUES (
  ` + q_value + `
    )
  `, { 
    replacements: q_replace
  })
  .then(function(result) {
    logger.debug("result: ", result);
    if(result[0].insertId === 0) return false;
    else return result[0].insertId;
  });
};

MysqlModel.prototype.createRowWithId = function(table_name, data) {
  if (!table_name || typeof data !== 'object') 
    throw new Error('MysqlModel#createRowWithId need `table_name` and `data` object');

  var q = "";
  var q_value = "";
  var q_replace = [];

  var keys = Object.keys(data);
  for (var i in keys) {
    if(data[keys[i]]) {
      q += ', `' + keys[i] + '`';
      q_value += ', ?';
      q_replace.push(data[keys[i]]);
    }
  }
  if(q_replace.length === 0) return false;
  q = q.substring(2);
  q_value = q_value.substring(2);

  return this.db.query(`
    INSERT INTO 
      \`` + table_name + `\`
    (
  ` + q + `
    ) VALUES (
  ` + q_value + `
    )
  `, { 
    replacements: q_replace
  })
  .then(function(result) {
    logger.debug("result: ", result);
    return result[0].affectedRows > 0 ? true : false;
  });
}

MysqlModel.prototype.checkRowExist = function(table_name, column_constraints) {
  if (!table_name || typeof column_constraints !== 'object') 
    throw new Error('MysqlModel#checkRowExist need `table_name` and `column_constraints` object');

  var w = "";
  var w_replace = [];

  var keys = Object.keys(column_constraints);
  for (var i in keys) {
    if(column_constraints[keys[i]]) {
      w += ' AND `' + keys[i] + '` = ?';
      w_replace.push(column_constraints[keys[i]]);
    }
  }
  if(w_replace.length === 0) return false;
  w = w.substring(5);

  return this.db.query(`
    SELECT
      1
    FROM
      \`` + table_name + `\`
    WHERE
  ` + w + `
  `, { 
    replacements: w_replace,
    type: this.db.QueryTypes.SELECT
  })
  .then(function(result) {
    logger.debug("result: ", result);
    return result.length > 0 ? true : false;
  });
}

MysqlModel.prototype.updateRows = function(table_name, data, column_constraints) {
  if (!table_name || typeof data !== 'object' || typeof column_constraints !== 'object') 
    throw new Error('MysqlModel#updateRows need `table_name`, `data` object and `column_constraints` object');

  // data
  var q = "";
  var q_replace = [];
  var keys = Object.keys(data);
  for (var i in keys) {
    if(data[keys[i]]) {
      q += ', `' + keys[i] + '` = ?';
      q_replace.push(data[keys[i]]);
    }
  }
  if(q_replace.length === 0) return false;
  q = q.substring(2);
  // column_constraints
  var w = "";
  var w_replace = [];
  var keys = Object.keys(column_constraints);
  for (var i in keys) {
    if(column_constraints[keys[i]]) {
      w += ' AND `' + keys[i] + '` = ?';
      w_replace.push(column_constraints[keys[i]]);
    }
  }
  if(w_replace.length === 0) return false;
  w = w.substring(5);

  return this.db.query(`
    UPDATE 
      \`` + table_name + `\`
    SET 
  ` + q + `
    WHERE 
  ` + w + `
  `, { 
    replacements: q_replace.concat(w_replace)
  })
  .spread(function(results, metadata) {
    logger.debug("results: ", results);
    logger.debug("metadata: ", metadata);
    return metadata.affectedRows > 0 ? true : false;
  });
}

MysqlModel.prototype.getRow = function(table_name, target_columns, column_constraints) {
  if (!table_name || !Array.isArray(target_columns) || typeof column_constraints !== 'object') 
    throw new Error('MysqlModel#getRow need `table_name`, `target_columns` array and `column_constraints` object');

  if(target_columns.length === 0) return false;
  var q = "";
  for (var i in target_columns) {
    q += ', `' + target_columns[i] + '`';
  }
  q = q.substring(2);

  var w = "";
  var w_replace = [];
  var keys = Object.keys(column_constraints);
  for (var i in keys) {
    if(column_constraints[keys[i]]) {
      w += ' AND `' + keys[i] + '` = ?';
      w_replace.push(column_constraints[keys[i]]);
    }
  }
  if(w_replace.length === 0) return false;
  w = w.substring(5);

  return this.db.query(`
    SELECT
  ` + q + `
    FROM
      \`` + table_name + `\`
    WHERE
  ` + w + `
  `, { 
    replacements: w_replace,
    type: this.db.QueryTypes.SELECT
  })
  .then(function(result) {
    logger.debug("result: ", result);
    return result.length > 0 ? result[0] : null;
  });
}

module.exports = MysqlModel;