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
        error_type: 'SERVER_EXCEPTION',
        default_error_description: 'SERVER_EXCEPTION_DESC_DEFAULT',
      },
    },
    REQUEST: {
      // Rate-Limit Error
      RATE_LIMIT: {
        http_code: 429,
        meta_code: 429,
        error_type: 'REQUEST_LIMIT_EXCEPTION',
        default_error_description: 'REQUEST_LIMIT_EXCEPTION_DESC_DEFAULT',
      },
      // Parameter Error
      PARAMETER: {
        http_code: 400,
        meta_code: 400,
        error_type: 'REQUEST_SCHEMA_EXCEPTION',
        default_error_description: 'REQUEST_SCHEMA_EXCEPTION_DESC_DEFAULT',
      },
    },
  },
}

module.exports = response_codes;
