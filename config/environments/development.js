// Package
var config = require('nconf');

// Configs
var log_dir = '/var/log/node/empty-project';
config.set('logSetting', {
  'level': 'debug',
  'output': {
    'console': true,
    'file': true,
  },
  'dir': log_dir,
  'fsr_rotate': {
    'filename': log_dir + '/access-%DATE%.log',
    'frequency': 'daily',
    'verbose': false,
    'date_format': 'YYYYMMDD'
  },
});

config.set('multiLang', {
  'i18next': {
    'debug': true,
    'detection': {
      // order and from where user language should be detected
      'order': [/*'path', 'session', */ 'querystring', 'cookie', 'header'],

      // keys or params to lookup language from
      'lookupQuerystring': 'lng',
      'lookupCookie': 'i18next',
      'lookupSession': 'lng',
      'lookupPath': 'lng',
      'lookupFromPathIndex': 0,
    },
    'load': 'currentOnly',
    'fallbackLng': "en", // 備用語系，擷取失敗時會使用到這裡
    'backend': {
      'loadPath': "locales/{{lng}}/{{ns}}.json",
      'addPath': "locales/{{lng}}/{{ns}}.missing.json",
      'jsonIndent': 2, // jsonIndent to use when storing json files
    }
  },
  'i18nextMiddleware': {
    'ignoreRoutes': [/*"/foo"*/],
    'removeLngFromUrl': false
  },
});

config.set('dbSetting', {
  'enabled': [
    'mysql'
  ],
  'mongodb': {
    'hostname': 'localhost',
    'port': 27017,
    'database': 'empty_project',
    'username': 'root',
    'password': '123456',
  },
  'mysql': {
    'hostname': 'localhost',
    'port': 3306,
    'database': 'empty_project',
    'username': 'root',
    'password': '123456',
  },
});

config.set('securitySetting', {
  'rateLimit': {
    'windowMs': 15*60*1000, // 15 minutes 
    'max': 100,
    'delayMs': 0, // disabled 
    'message': "Too many request from this IP, please try again later.",
  },
});

config.set('authSetting', {
  'apikey': '123456',
  'scope': ['basic', 'role_a', 'role_b'],
  'jwt': {
    'SECRET': '9xQjhvF02vu7iG1R8IVOzTgXY55y8r6U',
    'TOKENTIME': 2 * 60 * 60, // hours * minutes/hour * seconds/minute = seconds
    'ETERNELTOKENTIME': 100 * 365 * 24 * 60 * 60, // years * days/year * hours/day * minutes/hour * seconds/minute = seconds
  },
});
