'use strict';
module.exports = function(app){
    const Helper = require('../../libs/helper');
    const VieHashing = require('../../libs/viehashing');

    return {
        list: function(req, res, next) {
            const content = res.getContent(req.controller + '/index', {});
            res.render('index', {
                content: content,
                js: [
                    'js/datatable.ajax.js'
                ]
            });
        },

        json: async function(req, res, next) {
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);
            const requestQuery = req.query;
            const pagination = requestQuery.pagination;
            const query = requestQuery.query || {};
            const sort = requestQuery.sort;
            let options = UserModel.buildConditions(query);

            Helper.log(options, 'OPTIONS');

            const total = await UserModel.count(options);

            pagination.page = parseInt(pagination.page);

            options.limit = pagination.page;
            options.offset = (pagination.page - 1) * pagination.perpage;
            options.order = [[sort.field, sort.sort]];
            const items = await UserModel.findAll(options);

            let meta = {
                page: pagination.page,
                pages: Math.ceil(total / pagination.perpage),
                perpage: pagination.perpage,
                field: sort.field,
                sort: sort.sort,
                total: total
            }

            let jsonData = {
                data: items,
                meta: meta
            }

            res.json(jsonData);
        },

        add: function(req, res, next) {
            let content = res.getContent(req.controller + '/add', {});
            if (!req.isAdmin()) {
                content = res.getContent('notpermission');
            }
            res.render('index', {
                content: content,
                js: [
                    'js/user.js'
                ]
            });
        },

        createUser: function(req, res, next) {
            if (!req.isAdmin()) {
                return res.json({status: 0});
            }

            let status = 0;
            const requestData = req.body;
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);
            const error = UserModel.validate(requestData);
            if (error.length == 0) {
                if (UserModel.save(requestData)) {
                    status = true;
                }
            }

            const jsonData = {
                status: status,
                error: error
            }
            res.json(jsonData);
        },

        edit: function(req, res, next) {
            res.send(req.params);
        },

        delete: function(req, res, next) {
            res.send(req.params);
        },

        login: function(req, res, next) {
            res.render('index');
        },

        doLogin: async function(req, res, next) {
            let session = req.session;
            let status = 0;

            const requestData = req.body;
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);

            const myUser = await UserModel.findOne({
                where: {email: requestData.account},
            });

            if (myUser != null && myUser.id > 0 && myUser.password == VieHashing.hash(requestData.password)) {
                status = 1;
                session.uid = myUser.id;
            }

            res.json({status: status, uid: session.uid});
        },

        doLogout: function(req, res, next) {
            let session = req.session;
            session.uid = 0;

            res.redirect('/'+ req.module +'/login');
        },

        profile: async function(req, res, next) {
            const session = req.session;
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);

            const myUser = await UserModel.findOne({
                where: {id: session.uid},
            });

            let formData = myUser.dataValues;

            let birthdayParts = formData.birthday.split('-');
            formData.birthday = birthdayParts[2] + '/' + birthdayParts[1] + '/' + birthdayParts[0];

            const content = res.getContent(req.controller + '/index', {formData: formData});
            res.render('index', {
                content: content,
                js: [
                    'js/profile.js'
                ]
            });
        },

        updateProfile: async function(req, res, next) {
            const session = req.session;
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);

            const requestData = req.body;

            const myUser = await UserModel.findOne({
                where: {id: session.uid},
            });

            myUser.fullname = requestData.fullname;
            myUser.phone = requestData.phone;
            myUser.address = requestData.address;
            myUser.gender = requestData.gender;
            let sqlBirthday = '';
            if (requestData.birthday != '') {
                let birthdayParts = requestData.birthday.split('/');
                sqlBirthday = birthdayParts[2] + '-' + birthdayParts[1] + '-' + birthdayParts[0];
            }
            myUser.birthday = sqlBirthday;

            const result = await myUser.save();
            if (typeof result !== 'undefined' && result.hasOwnProperty('dataValues')) {
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        },

        uploadAvatar: async function(req, res, next) {
            if (!req.files)
                return res.json({success: false, message: 'No file upload'});

            const session = req.session;
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);
            const myUser = await UserModel.findOne({
                where: {id: session.uid},
            });

            let avatarFile = req.files.avatar;

            const fileName = app.rootDir + '/public/assets/uploads/avatars/user' + myUser.id + '.jpg';
            const fileUrl = '/assets/uploads/avatars/user' + myUser.id + '.jpg';
            avatarFile.mv(fileName, function(err) {
                if (err)
                    return res.json({success: false, message: err});

                myUser.avatar = fileUrl;
                myUser.save().then(() => {
                    return res.json({success: true, avatar: fileUrl});
                }).catch(error => {
                    return res.json({success: false, message: 'Can not upload'});
                });
            });
        },
    }
}