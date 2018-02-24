'use strict';
module.exports = function(app){
    const Helper = require('../../libs/helper');

    const regionController = {
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
    }

    return regionController;
}