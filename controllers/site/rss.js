'use strict';

const Helper = require('../../libs/helper');
const Parser = require('rss-parser');

module.exports = function(app){
    return {
        getRSS: async function(req, res, next) {
            var link = req.query.link || '';
            let parser = new Parser();
            var feed = await parser.parseURL(link);
            res.json(feed);
        },
    }
}