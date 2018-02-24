'use strict';
module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var directory = 'site';

    var indexController = require('../../controllers/' + directory + '/index')(app);
    var regionController = require('../../controllers/' + directory + '/region')(app);
    var rssController = require('../../controllers/' + directory + '/rss')(app);
    var ibController = require('../../controllers/' + directory + '/ib')(app);

    /* Index Router */
    router.get('/', indexController.index);

    router.get('/region/select', regionController.select);

    /* RSS Router */
    router.get('/rss', rssController.getRSS);

    /* IB Router */
    router.get('/ib/register', ibController.register);
    router.post('/ib/register', ibController.saveIB);
    router.get('/ib/confirm', ibController.confirm);
    router.post('/ib/confirm', ibController.activeIB);
    router.post('/ib/resend', ibController.resendActiveCode);
    router.get('/ib/success', ibController.success);

    router.get('/notfound', function(req, res, next) {
      res.render(directory + '/notfound', { title: 'Express' });
    });

    app.use('/', router);
}