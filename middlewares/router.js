var in_array = require('in_array');

module.exports = function(app, options) {
    return function(req, res, next) {
        var parts = req.url.split('/');
        var isAsset = false;
        var module = 'site';
        var controller = 'index';
        var action = 'index';
        var defaultModules = ['site','admin'];

        parts.shift();
        if (parts.length > 0) {
            if (parts[0] == 'assets') {
                isAsset = true;
            } else {
                if (in_array(parts[0], defaultModules)) {
                    module = parts[0];
                    
                    if (typeof parts[1] !== 'undefined' && parts[1] != '') {
                        controller = parts[1];
                    }

                    if (typeof parts[2] !== 'undefined' && parts[2] != '') {
                        action = parts[2];
                    }
                } else if (parts[0] != '') {
                    controller = parts[0];
                    if (typeof parts[1] !== 'undefined' && parts[1] != '') {
                        action = parts[1];
                    }
                }
            }
        }

        req.isAsset = isAsset;
        req.module = module;
        req.controller = controller;
        req.action = action;
        next();
    };
}