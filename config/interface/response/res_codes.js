'use strict';

// Main Export
var response_codes = {
  // Success
  SUCCESS: {
    BASIC: {
      API_CALL: {
        code: 200,
        message: 'API_CALL_SUCCESS',
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
