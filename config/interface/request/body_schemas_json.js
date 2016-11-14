'use strict';

// Main Export
var request_body_schema = {
  ExampleResourceRepresentationPost: {
    type: 'object',
    properties: {
      a: {
          type: 'string',
      },
      b: {
          type: 'string',
      },
    },
    required: [
      "a",
      "b",
    ]
  },

}

module.exports = request_body_schema;
