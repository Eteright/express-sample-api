'use strict';

// Main Export
var Constants = {
  TYPE_1: {
    MAGIC_1: 100
  },
  DB: {
    PHONE_STATUS: {
      EMPTY: 0,
      WAIT: 1,
      PASS: 2,
    },
    EMAIL_STATUS: {
      EMPTY: 0,
      WAIT: 1,
      PASS: 2,
    },
    TARGET_TYPE: {
      GATEWAY: 10,
      GATEWAY_GROUP: 11,
      DEVICE: 20,
      DEVICE_GROUP: 21,
    },
    AUTHORITY_TYPE: {
      FULL: 125,
    },
  },
}

module.exports = Constants;
