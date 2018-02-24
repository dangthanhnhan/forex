'use strict';
module.exports = function(app){
    const Helper = require('../../libs/helper');

    const ibController = {
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
            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);
            const RegionModel = require(app.rootDir + '/models/region')(req.db, app);
            const requestQuery = req.query;
            const pagination = requestQuery.pagination;
            const query = requestQuery.query || {};
            const sort = requestQuery.sort;
            let options = IntroductionBrokerModel.buildConditions(query);

            const total = await IntroductionBrokerModel.count(options);

            pagination.page = parseInt(pagination.page);

            options.limit = parseInt(pagination.perpage);
            options.offset = (pagination.page - 1) * pagination.perpage;
            options.order = [[sort.field, sort.sort]];
            options.include = [
                {model: RegionModel, as: 'City'},
                {model: RegionModel, as: 'District'},
                {model: RegionModel, as: 'Ward'}
            ];
            const items = await IntroductionBrokerModel.findAll(options);

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

        edit: async function(req, res, next) {
            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);
            const RegionModel = require(app.rootDir + '/models/region')(req.db, app);
            const id = req.params.id || 0;

            let myObject;
            try {
                myObject = await IntroductionBrokerModel.getById(id);
            } catch (err) {
                myObject = {id: 0};
            }

            if (myObject.id == 0) {
                return res.redirect('/' + req.module + '/' + req.controller);
            }

            let formData = myObject.dataValues;

            let birthdayParts = myObject.birthday.split('-');
            formData.birthday = birthdayParts[2] + '/' + birthdayParts[1] + '/' + birthdayParts[0];

            const content = res.getContent(req.controller + '/edit', {
                formData: formData,
                countries: RegionModel.getCountries(),
            });
            res.render('index', {
                content: content,
                js: []
            });
        },

        doEdit: async function(req, res, next) {
            const IntroductionBrokerModel = require(app.rootDir + '/models/introductionbroker')(req.db, app);
            const id = req.params.id || 0;
            const requestData = req.body;

            let myObject;
            try {
                myObject = await IntroductionBrokerModel.getById(id);
            } catch (err) {
                myObject = {id: 0};
            }

            if (myObject.id == 0) {
                return res.json({status: 0, error: ['Không tìm thấy IB!']});
            }

            for (let props in requestData) {
                let data = requestData[props];
                if (props == 'birthday') {
                    const parts = data.split('/');
                    data = parts[2] + '-' + parts[1] + '-' + parts[0];
                }
                myObject[props] = data;
            }

            console.log(myObject);

            const result = await myObject.save();
            if (typeof result !== 'undefined' && result.hasOwnProperty('dataValues')) {
                return res.json({status: 1});
            } else {
                return res.json({status: 0, error: []});
            }
        }
    }

    return ibController;
}