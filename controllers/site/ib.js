'use strict';

const Helper = require('../../libs/helper');
const nodemailer = require('nodemailer');

module.exports = function(app){
    const ibController = {
        register: function(req, res, next) {
            const content = res.getContent(req.controller + '/register');
            res.render('index', {
                content: content,
                includeHeader: false,
                includeFooter: false,
                css: [],
                js: [
                    'js/ib.js'
                ]
            });
        },

        saveIB: async function(req, res, next) {
            let status = 0;
            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);

            const requestData = req.body;
            const email = requestData.email;
            const error = await IntroductionBrokerModel.validate(requestData);

            if (error.length == 0) {
                const code = Helper.random(100000, 999999);
                requestData.activationcode = code;

                if (requestData.birthday != '') {
                    let birthdayParts = requestData.birthday.split('/');
                    requestData.birthday = new Date(birthdayParts[2], birthdayParts[1] - 1, birthdayParts[0]);
                } else {
                    requestData.birthday = new Date(1970,0,1);
                }
                requestData.status = IntroductionBrokerModel.STATUS_UNACTIVE;
                console.log(requestData);

                var result = await IntroductionBrokerModel.save(requestData);
                if (result) {
                    status = 1;
                    if (email != '') {
                        ibController.sendActiveCode(email, code);
                    }
                }
            }

            const jsonData = {
                status: status,
                error: error,
                email: email
            }
            res.json(jsonData);
        },

        confirm: function(req, res, next) {
            const query = req.query;
            const email = query.email;

            if (typeof email !== 'undefined' && email != '') {
                const content = res.getContent(req.controller + '/confirm', {email: email});

                return res.render('confirm', {
                    content: content,
                    includeHeader: false,
                    includeFooter: false,
                    css: [],
                    js: [
                        'js/ib.js'
                    ]
                });
            }

            return res.redirect('/' + req.controller + '/register');
        },

        activeIB: async function(req, res, next) {
            const requestData = req.body;
            const email = requestData.email;
            const activationCode = requestData.activation_code;

            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);

            let myObject;
            try {
                myObject = await IntroductionBrokerModel.getByEmail(email);
            } catch (err) {
                myObject = {id: 0};
            }

            if (myObject.id == 0) {
                return res.json({
                    status: 0,
                    error: ['Email không tồn tại.']
                });
            }

            if (myObject.status == IntroductionBrokerModel.STATUS_ACTIVE) {
                return res.json({status: 1});
            }

            if (myObject.activationcode != activationCode) {
                return res.json({
                    status: 0,
                    error: ['Mã kích hoạt không hợp lệ.']
                });
            }

            myObject.activationcode = '';
            myObject.status = IntroductionBrokerModel.STATUS_ACTIVE;

            [err, myObject] = await Helper.to(myObject.save());
            if (err) {
                return res.json({
                    status: 0,
                    error: ['Kích hoạt tài khoản thất bại. Vui lòng thử lại sau!']
                });
            }

            return res.json({status: 1});
        },

        resendActiveCode: async function(req, res, next) {
            const requestData = req.body;
            const email = requestData.email;

            const code = Helper.random(100000, 999999);
            if (!Helper.validateEmail(email)) {
                return res.json({
                    status: 0,
                    error: ['Email không hợp lệ.']
                });
            }

            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);

            let myObject;
            try {
                myObject = await IntroductionBrokerModel.getByEmail(email);
            } catch (err) {
                myObject = {id: 0};
            }

            if (myObject.id == 0) {
                return res.json({
                    status: 0,
                    error: ['Email không tồn tại.']
                });
            }

            myObject.activationcode = code.toString();
            [err, myObject] = await Helper.to(myObject.save());
            if (err) {
                return res.json({
                    status: 0,
                    error: ['Gửi mã xác nhận không thành công. Vui lòng thử lại!']
                });
            }

            ibController.sendActiveCode(email, code);

            res.json({status: 1});
        },

        sendActiveCode: function(email, code) {
            const config = app.get('config');
            const mailer = config.mailer;
            const transporter = nodemailer.createTransport({
                host: mailer.host,
                port: mailer.port,
                secure: mailer.ssl, // true for 465, false for other ports
                auth: {
                    user: mailer.username, // generated ethereal user
                    pass: mailer.password  // generated ethereal password
                }
            });

            let mailOptions = {
                from: '"' + mailer.from_address + '" <' + mailer.from_email + '>', // sender address
                to: email, // list of receivers
                subject: '[Forex] IB Activation ', // Subject line
                html: 'Your activation code is <b>' + code + '</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        },

        success: function(req, res, next) {
            const content = res.getContent(req.controller + '/success');
            res.render('index', {
                content: content,
                includeHeader: false,
                includeFooter: false,
                css: [],
                js: [
                    'js/ib.js'
                ]
            });
        }
    }
    return ibController;
}