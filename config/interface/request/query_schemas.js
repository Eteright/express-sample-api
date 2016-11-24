'use strict';

// Main Export
var request_query_schema = {
  ExampleResourceRepresentationGet: {
    'email': {
      in: 'query',
      optional: {
        options: { checkFalsy: true } // or: [{ checkFalsy: true }]
      },
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    'type': {
      in: 'query',
      notEmpty: true,
      matches: {
        options: ['example', 'i'] // pass options to the validator with the options property as an array
        // options: [/example/i] // matches also accepts the full expression in the first parameter
      },
      errorMessage: 'Invalid Type' // Error message for the parameter
    },
    'name.first': { //
      in: 'query',
      optional: true, // won't validate if field is empty
      isLength: {
        options: [{ min: 2, max: 10 }],
        errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message
      },
      errorMessage: 'Invalid First Name'
    }
  },

}

module.exports = request_query_schema;
