'use strict';

const feed = require("feed-read-parser");

module.exports = function(app){
    return {
        getRSS: async function(req, res, next) {
            var link = req.query.link || '';
            let items = [];
            await feed(link, function(err, articles) {
                if (err) throw err;
                for (let i = 0; i < articles.length; i++) {
                    const article = articles[i];
                    console.log(article);
                    items.push(article);
                }
            });
            res.json({items: items});
        },
    }
}