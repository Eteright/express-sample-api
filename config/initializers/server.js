// config/initializers/server.js
'use strict';

var express = require('express');
var cors    = require('cors');
var path    = require('path');
// Local dependecies
var config  = require('nconf');

// create the express app
// configure middlewares 
var i18next           = require('i18next');  
var i18nextFsBackend  = require('i18next-node-fs-backend');  
var i18nextMiddleware = require('i18next-express-middleware');
var body_parser       = require('body-parser');
var express_validator = require('express-validator');
var oz_flow           = require('oz-core-express');
var morgan            = require('morgan');
var fs                = require('fs');
var fsr               = require('file-stream-rotator');
var shell             = require('shelljs');
var logger            = require('winston');
var rest              = require('libs/lib_rest');
var app;

var starter =  function(cb) {
  var logSetting = config.get('logSetting');
  logger.level = logSetting.level;
  logger.info('[SERVER] try to initialize server...');
  // Configure express 
  app = express();

  // Corse Domain Support
  app.use(cors());
  // If Behind a Reverse Proxy
  app.enable('trust proxy');

  // Request
  // - Diary
  if(logSetting.output.console) app.use(morgan('combined'));
  if(logSetting.output.console) {
    var log_dir = logSetting.dir;
    // ensure log directory exists
    fs.existsSync(log_dir) || shell.mkdir("-p", log_dir);
    // create a rotating write stream
    var access_log_stream = fsr.getStream(logSetting.fsr_rotate)
    app.use(morgan('common', {stream: access_log_stream}));
  }
  // - Parser
  app.use(body_parser.json({type: 'application/json'}));
  app.use(body_parser.urlencoded({extended: false}));
  // - Validator
  app.use(express_validator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  // Multi-Language Support
  i18next.use(i18nextMiddleware.LanguageDetector)
  .use(i18nextFsBackend)
  .init(config.get('multiLang').i18next);
  app.use(i18nextMiddleware.handle(i18next, config.get('multiLang').i18nextMiddleware));

  // Auth
  require('config/initializers/security/auth_design').initialize();
  app.use(oz_flow.initialize());

  // Add all routing
  logger.info('[SERVER] Initializing routes');
  require('config/initializers/routes')(app);

  // Expose Static Files
  app.use(express.static(path.join(__dirname, '/../../public')));

  // Default Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });

  // Listen Port
  app.listen(config.get('NODE_PORT'));
  logger.info('[SERVER] initialized SUCCESSFULLY, listening on port ' + config.get('NODE_PORT'));
  
  cb(null);
};

module.exports = starter;
