'use strict';
module.exports = function(app){
    const Helper = require('../../libs/helper');

    const regionController = {
        json: async function(req, res, next) {
            const RegionModel = require(app.rootDir + '/models/region')(req.db, app);
            const requestQuery = req.query;
            const pagination = requestQuery.pagination;
            const query = requestQuery.query || {};
            const sort = requestQuery.sort;
            let options = RegionModel.buildConditions(query);

            const total = await RegionModel.count(options);

            pagination.page = parseInt(pagination.page) || 1;

            options.limit = pagination.page;
            options.offset = (pagination.page - 1) * pagination.perpage;
            options.order = [[sort.field, sort.sort]];
            const items = await RegionModel.findAll(options);

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

        select: async function(req, res, next) {
            const RegionModel = require(app.rootDir + '/models/region')(req.db, app);
            const requestQuery = req.query;
            let pagination = {};
            let options = RegionModel.buildConditions(requestQuery);

            const total = await RegionModel.count(options);

            pagination.page = parseInt(requestQuery.page) || 1;
            pagination.perpage = 1000;

            options.limit = pagination.perpage;
            options.offset = (pagination.page - 1) * pagination.perpage;
            options.order = [['displayorder', 'ASC']];
            const items = await RegionModel.findAll(options);

            let jsonData = {
                items: items
            }

            res.json(jsonData);
        },

        detail: function(req, res, next) {
            const RegionModel = require(app.rootDir + '/models/region')(req.db, app);
            const id = req.params.id;

            RegionModel.findById(id).then(region => {
                res.json(region);
            });
        }
    }

    return regionController;
}