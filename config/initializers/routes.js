'use strict';

const controllers_path = 'app/controllers/';
var change_case = require('change-case');
var express = require('express');
var routes = require('require-dir')('../../app/controllers/');

module.exports = function(app) {
    // Initialize all routes
    Object.keys(routes).forEach(function(route_name) {
        var router = express.Router();
        // You can add some middleware here 
        // router.use(someMiddleware);
    
        // Initialize the route to add its functionality to router
        require(controllers_path + route_name)(router);
    
        // Add router to the speficied route name in the app
        app.use('/' + change_case.paramCase(route_name.replace('_', '.')), router);
    }); 
};