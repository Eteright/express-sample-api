'use strict';

// Main Export
var response_codes = {
  // Success
  SUCCESS: {
    BASIC: {
      // General
      API_CALL: {
        code: 200,
        message: 'API_CALL_SUCCESS',
      },
      // Database
      DB_CREATE: {
        code: 200,
        message: 'DB_CREATE_SUCCESS',
      },
      DB_READ: {
        code: 200,
        message: 'DB_READ_SUCCESS',
      },
      DB_UPDATE: {
        code: 200,
        message: 'DB_UPDATE_SUCCESS',
      },
      DB_DELETE: {
        code: 200,
        message: 'DB_DELETE_SUCCESS',
      },
    },
  },

  // Error
  ERROR: {
    BASIC: {
      // Server Error
      SERVER: {
        http_code: 500,
        meta_code: 500,
        error: 'SERVER_EXCEPTION',
        default_error_description: 'SERVER_EXCEPTION_DESC_DEFAULT',
      },
      // DB Error
      DB: {
        http_code: 400,
        meta_code: 1000,
        error: 'DB_CREATE_EXCEPTION',
        default_error_description: 'DB_CREATE_EXCEPTION_DESC_DEFAULT',
      },
      DB_CREATE: {
        http_code: 400,
        meta_code: 1001,
        error: 'DB_CREATE_EXCEPTION',
        default_error_description: 'DB_CREATE_EXCEPTION_DESC_DEFAULT',
      },
      DB_READ: {
        http_code: 400,
        meta_code: 1002,
        error: 'DB_READ_EXCEPTION',
        default_error_description: 'DB_READ_EXCEPTION_DESC_DEFAULT',
      },
      DB_UPDATE: {
        http_code: 400,
        meta_code: 1003,
        error: 'DB_UPDATE_EXCEPTION',
        default_error_description: 'DB_UPDATE_EXCEPTION_DESC_DEFAULT',
      },
      DB_DELETE: {
        http_code: 400,
        meta_code: 1004,
        error: 'DB_DELETE_EXCEPTION',
        default_error_description: 'DB_DELETE_EXCEPTION_DESC_DEFAULT',
      },
      // 
    },
    REQUEST: {
      // Rate-Limit Error
      RATE_LIMIT: {
        http_code: 429,
        meta_code: 429,
        error: 'REQUEST_LIMIT_EXCEPTION',
        default_error_description: 'REQUEST_LIMIT_EXCEPTION_DESC_DEFAULT',
      },
      // Auth-Error
      AUTH: {
        BASIC_AUTH: {
          http_code: 401,
          meta_code: 401,
          error: 'BASIC_AUTH_EXCEPTION',
          default_error_description: 'BASIC_AUTH_EXCEPTION_DESC_DEFAULT',
        },
        API_KEY: {
          http_code: 401,
          meta_code: 401,
          error: 'API_KEY_EXCEPTION',
          default_error_description: 'API_KEY_EXCEPTION_DESC_DEFAULT',
        },
        OAUTH2: {
          REQ: {
            INVALID_REQUEST: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_REQ_INVALID_REQUEST',
              default_error_description: 'OAUTH2_REQ_INVALID_REQUEST_DESC_DEFAULT',
              error_uri: '',
            },
            INVALID_CLIENT: {
              http_code: 401,
              meta_code: 401,
              error: 'OAUTH2_REQ_INVALID_CLIENT',
              default_error_description: 'OAUTH2_REQ_INVALID_CLIENT_DESC_DEFAULT',
              error_uri: '',
            },
            INVALID_GRANT: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_REQ_INVALID_GRANT',
              default_error_description: 'OAUTH2_REQ_INVALID_GRANT_DESC_DEFAULT',
              error_uri: '',
            },
            UNAUTHORIZED_CLIENT: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_REQ_UNAUTHORIZED_CLIENT',
              default_error_description: 'OAUTH2_REQ_UNAUTHORIZED_CLIENT_DESC_DEFAULT',
              error_uri: '',
            },
            UNSUPPORTED_GRANT_TYPE: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_REQ_UNSUPPORTED_GRANT_TYPE',
              default_error_description: 'OAUTH2_REQ_UNSUPPORTED_GRANT_TYPE_DESC_DEFAULT',
              error_uri: '',
            },
            INVALID_SCOPE: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_REQ_INVALID_SCOPE',
              default_error_description: 'OAUTH2_REQ_INVALID_SCOPE_DESC_DEFAULT',
              error_uri: '',
            },
          },
          RES: {
            INVALID_REQUEST: {
              http_code: 400,
              meta_code: 400,
              error: 'OAUTH2_RES_INVALID_REQUEST',
              default_error_description: 'OAUTH2_RES_INVALID_REQUEST_DESC_DEFAULT',
              error_uri: '',
            },
            INVALID_TOKEN: {
              http_code: 401,
              meta_code: 401,
              error: 'OAUTH2_RES_INVALID_TOKEN',
              default_error_description: 'OAUTH2_RES_INVALID_TOKEN_DESC_DEFAULT',
              error_uri: '',
            },
            INSUFFICIENT_SCOPE: {
              http_code: 403,
              meta_code: 403,
              error: 'OAUTH2_RES_INSUFFICIENT_SCOPE',
              default_error_description: 'OAUTH2_RES_INSUFFICIENT_SCOPE_DESC_DEFAULT',
              error_uri: '',
            },
          },
        },
      },
      // Parameter Error
      PARAMETER: {
        http_code: 400,
        meta_code: 400,
        error: 'REQUEST_SCHEMA_EXCEPTION',
        default_error_description: 'REQUEST_SCHEMA_EXCEPTION_DESC_DEFAULT',
      },
    },
  },
}

module.exports = response_codes;
