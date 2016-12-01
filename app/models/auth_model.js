// app/models/auth_model.js
'use strict';

/**
 * Module dependencies.
 */
var BaseModel = require('app/models/core/mysql_model')
  , util = require('util')
  , logger = require('winston')
  , moment = require('moment');
var CONST = require('config/constants');


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
 * @param {Object} app_code the app_code column of apps table
 * @api protected
 */
AuthModel.prototype.readAppClientInfo = function(app_code) {
  if (!app_code) throw new Error('AuthModel#readAppClientInfo need `app_code` parameter');

  return this.db.query(`
    SELECT 
      a.\`app_id\`,
      a.\`app_secret\`,
      a.\`scope_basic\`,
      a.\`scope_role_system\`,
      a.\`scope_role_app\`,
      a.\`scope_role_gateway\`
    FROM
      \`apps\` AS a
    WHERE 
      a.\`app_code\` = ?
    AND
      a.\`suspend\` = 0
  `, { 
    replacements: [
      app_code
    ],
    type: this.db.QueryTypes.SELECT
  })
  .then(function(app_client_info) {
    logger.debug("app_client_info: ", app_client_info);
    return app_client_info.length > 0 ? app_client_info[0] : null;
  });
}

/**
 * some description
 *
 * @param {Object} account the account column of users table
 * @api protected
 */
AuthModel.prototype.readUserAccountInfo = function(account) {
  if (!account) throw new Error('AuthModel#readUserAccountInfo need `account` parameter');

  return this.db.query(`
    SELECT 
      u.\`user_id\`,
      u.\`password\`,
      u.\`phone_status\`,
      u.\`email_status\`,
      u.\`suspend\`
    FROM
      \`users\` AS u
    WHERE 
      u.\`account\` = ?
    AND
      u.\`suspend\` = 0
  `, { 
    replacements: [
      account
    ],
    type: this.db.QueryTypes.SELECT
  })
  .then(function(user_account) {
    logger.debug("user_account: ", user_account);
    return user_account.length > 0 ? user_account[0] : null;
  });
}

/**
 * some description
 *
 * @param {Object} client_device_code the client_device_code column of client_devices table
 * @api protected
 */
AuthModel.prototype.createClientDevice = function(client_device_code) {
  if (!client_device_code) throw new Error('AuthModel#createClientDevice need `client_device_code` parameter');

  return this.db.query(`
    INSERT INTO
      \`client_devices\`
    (
      client_device_code, 
      update_time, 
      create_time
    ) VALUES (
      ?,
      ?,
      ?
    )
    ON DUPLICATE KEY UPDATE
      update_time = ?
  `, { 
    replacements: [
      client_device_code,
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
    ]
  })
  .then(function(result) {
    logger.debug("result: ", result);
    if(result[0].insertId === 0) return false;
    else return result[0].insertId;
  });
}

/**
 * some description
 *
 * @param {Object} client_device_id the client_device_id column of users table
 * @param {Object} app_code the app_code column of users table
 * @param {Object} user_id the user_id column of users table
 * @api protected
 */
AuthModel.prototype.readClientInfo = function(client_device_id, app_code, user_id) {
  if (!client_device_id || !app_code || !user_id) throw new Error('AuthModel#readClientInfo need `client_device_id`, `app_code`, `user_id` parameters');

  return this.db.query(`
    SELECT 
      c.\`client_id\`,
      c.\`app_version\`,
      c.\`last_login_time\`
    FROM
      \`clients\` AS c
    WHERE 
      c.\`client_device_id\` = ?
    AND
      c.\`app_code\` = ?
    AND
      c.\`user_id\` = ?
  `, { 
    replacements: [
      client_device_id,
      app_code,
      user_id,
    ],
    type: this.db.QueryTypes.SELECT
  })
  .then(function(client_info) {
    logger.debug("client_info: ", client_info);
    return client_info.length > 0 ? client_info[0] : null;
  });
}

/**
 * some description
 *
 * @param {Object} client_device_id the client_device_id column of client_devices table
 * @param {Object} app_code the app_code column of client_devices table
 * @param {Object} app_version the app_version column of client_devices table
 * @param {Object} user_id the user_id column of client_devices table
 * @api protected
 */
AuthModel.prototype.createClient = function(client_device_id, app_code, app_version, user_id) {
  if (!client_device_id || !app_code || !app_version || !user_id) throw new Error('AuthModel#createClient need `client_device_id`, `app_code`, `app_version`, `user_id` parameters');
  return this.db.query(`
    INSERT INTO
      \`clients\`(
        client_device_id, 
        app_code, 
        app_version, 
        user_id, 
        last_login_time, 
        update_time, 
        create_time
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    ) ON DUPLICATE KEY UPDATE
      update_time = ?
  `, { 
    replacements: [
      client_device_id,
      app_code,
      app_version,
      user_id,
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
    ]
  })
  .then(function(result) {
    logger.debug("result: ", result);
    if(result[0].insertId === 0) return false;
    else return result[0].insertId;
  });
}

/**
 * some description
 *
 * @param {Object} client_id the client_id column of client_devices table
 * @api protected
 */
AuthModel.prototype.createClientAuth = function(client_id) {
  if (!client_id) throw new Error('AuthModel#createClientAuth need `client_id` parameter');
  
  return this.db.query(`
    INSERT IGNORE INTO
      \`client_auths\`(
        client_id, 
        update_time, 
        create_time
      )
    VALUES(
      ?, 
      ?,
      ?
    )
  `, { 
    replacements: [
      client_id,
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
      moment().format("YYYY\-MM\-DD HH:mm:ss"),
    ]
  })
  .then(function(result) {
    logger.debug("result: ", result);
    if(result[0].insertId === 0) return false;
    else return result[0].insertId;
  });
}

/**
 * some description
 *
 * @param {Object} app_code the app_code column of users table
 * @param {Object} user_id the user_id column of users table
 * @param {Object} target_type the target_type column of users table
 * @param {Object} target_id the target_id column of users table
 * @api protected
 */
AuthModel.prototype.checkUserGroupAuthority = function(app_code, user_id, target_type, target_id) {
  if (!app_code || !user_id || !target_type || !target_id) throw new Error('AuthModel#checkUserGroupAuthority need `app_code`, `user_id`, `target_type`, `target_id` parameters');
  
  switch(target_type) {
    case CONST.DB.TARGET_TYPE.GATEWAY:
      return this.db.query(`
        SELECT 
          1
        FROM
          \`user_group_maps\` AS ugm
        JOIN
          \`user_group_authorities\` AS uga
        ON
          uga.\`user_group_id\` = ugm.\`user_group_id\`
        AND
          uga.\`is_deleted\` = 0
        WHERE 
          ugm.\`app_code\` = ?
        AND
          ugm.\`user_id\` = ?
        AND
          ugm.\`is_deleted\` = 0
        AND
          uga.\`target_type\` = 10
        AND
          uga.\`target_id\` = ?
        UNION
        SELECT 
          1
        FROM
          \`user_group_maps\` AS ugm
        JOIN
          \`user_group_authorities\` AS uga
        ON
          uga.\`user_group_id\` = ugm.\`user_group_id\`
        AND
          uga.\`is_deleted\` = 0
        JOIN
          \`gateway_groups\` AS gg
        ON
          gg.\`group_id\` = uga.\`target_id\`
        AND
          gg.\`is_deleted\` = 0
        JOIN
          \`gateway_group_members\` AS ggm
        ON
          ggm.\`gateway_group_id\` = gg.\`group_id\`
        AND
          ggm.\`is_deleted\` = 0
        WHERE 
          ugm.\`app_code\` = ?
        AND
          ugm.\`user_id\` = ?
        AND
          ugm.\`is_deleted\` = 0
        AND
          uga.\`target_type\` = 11
        AND
          ggm.\`gateway_id\` = ?
      `, { 
        replacements: [
          app_code,
          user_id,
          target_id,

          app_code,
          user_id,
          target_id,
        ],
        type: this.db.QueryTypes.SELECT
      })
      .then(function(result) {
        logger.debug("result: ", result);
        return result.length > 0 ? true : false;
      });
    break;
    case CONST.DB.TARGET_TYPE.DEVICE:
      return this.db.query(`
        SELECT 
          1
        FROM
          \`user_group_maps\` AS ugm
        JOIN
          \`user_group_authorities\` AS uga
        ON
          uga.\`user_group_id\` = ugm.\`user_group_id\`
        AND
          uga.\`is_deleted\` = 0
        WHERE 
          ugm.\`app_code\` = ?
        AND
          ugm.\`user_id\` = ?
        AND
          ugm.\`is_deleted\` = 0
        AND
          uga.\`target_type\` = 20
        AND
          uga.\`target_id\` = ?
        UNION
        SELECT 
          1
        FROM
          \`user_group_maps\` AS ugm
        JOIN
          \`user_group_authorities\` AS uga
        ON
          uga.\`user_group_id\` = ugm.\`user_group_id\`
        AND
          uga.\`is_deleted\` = 0
        JOIN
          \`device_groups\` AS dg
        ON
          dg.\`group_id\` = uga.\`target_id\`
        AND
          dg.\`is_deleted\` = 0
        JOIN
          \`device_group_members\` AS dgm
        ON
          dgm.\`device_group_id\` = dg.\`group_id\`
        AND
          dgm.\`is_deleted\` = 0
        WHERE 
          ugm.\`app_code\` = ?
        AND
          ugm.\`user_id\` = ?
        AND
          ugm.\`is_deleted\` = 0
        AND
          uga.\`target_type\` = 21
        AND
          dgm.\`device_id\` = ?
      `, { 
        replacements: [
          app_code,
          user_id,
          target_id,

          app_code,
          user_id,
          target_id,
        ],
        type: this.db.QueryTypes.SELECT
      })
      .then(function(result) {
        logger.debug("result: ", result);
        return result.length > 0 ? true : false;
      });
    break;
    case CONST.DB.TARGET_TYPE.GATEWAY_GROUP:
    case CONST.DB.TARGET_TYPE.DEVICE_GROUP:
    default:
      return this.db.query(`
        SELECT 
          1
        FROM
          \`user_group_maps\` AS ugm
        JOIN
          \`user_group_authorities\` AS uga
        ON
          uga.\`user_group_id\` = ugm.\`user_group_id\`
        AND
          uga.\`is_deleted\` = 0
        WHERE 
          ugm.\`app_code\` = ?
        AND
          ugm.\`user_id\` = ?
        AND
          ugm.\`is_deleted\` = 0
        AND
          uga.\`target_type\` = ?
        AND
          uga.\`target_id\` = ?
      `, { 
        replacements: [
          app_code,
          user_id,
          target_type,
          target_id,
        ],
        type: this.db.QueryTypes.SELECT
      })
      .then(function(result) {
        logger.debug("result: ", result);
        return result.length > 0 ? true : false;
      });
    break;
  }
}

module.exports = new AuthModel();
// we dont't need to expose constructor here, like
// exports.AuthModel = AuthModel;
