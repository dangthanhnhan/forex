'use strict';
module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var indexController = require('../../controllers/admin/index')(app);
    var rssController = require('../../controllers/admin/rss')(app);
    var userController = require('../../controllers/admin/user')(app);
    var regionController = require('../../controllers/admin/region')(app);
    var ibController = require('../../controllers/admin/ib')(app);

    /* Index Router */
    router.get('/', indexController.index);
    router.get('/index', indexController.index);

    /* RSS Router */
    router.get('/rss', rssController.getRSS);

    /* Login Router */
    router.get('/login', userController.login);
    router.post('/login', userController.doLogin);
    /* Logout Router */
    router.get('/logout', userController.doLogout);

    /* Logout Router */
    router.get('/region/json', regionController.json);
    router.get('/region/select', regionController.select);
    router.get('/region/:id', regionController.detail);

    /* Profile Router */
    router.get('/profile', userController.profile);
    router.post('/profile', userController.updateProfile);
    router.post('/profile/uploadavatar', userController.uploadAvatar);

    /* User Router */
    router.get('/user', userController.list);
    router.get('/user/json', userController.json);
    router.get('/user/add', userController.add);
    router.post('/user/add', userController.createUser);
    router.get('/user/edit/:id', userController.edit);
    router.get('/user/delete/:id', userController.delete);

    /* IB Router */
    router.get('/ib', ibController.list);
    router.get('/ib/json', ibController.json);
    router.get('/ib/:id', ibController.edit);
    router.post('/ib/:id', ibController.doEdit);

    app.use('/admin', router);
}