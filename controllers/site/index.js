'use strict';
module.exports = function(app){
    return {
        index: function(req, res, next) {
            const rssMain = {
                name: 'Tài chính',
                link: 'https://vnexpress.net/rss/kinh-doanh.rss'
            };
            const rssSources = [
                {
                    name: 'Thể thao',
                    link: 'http://www.24h.com.vn/upload/rss/thethao.rss',
                },
                {
                    name: 'Khoa học',
                    link: 'https://vnexpress.net/rss/khoa-hoc.rss',
                },
                {
                    name: 'Du lịch',
                    link: 'https://vnexpress.net/rss/du-lich.rss',
                },
                {
                    name: 'Forex',
                    link: 'https://traderviet.com/forums/thi-truong-forex-commodities.9/index.rss',
                },
                {
                    name: 'Cười',
                    link: 'https://vnexpress.net/rss/cuoi.rss',
                },
            ];

            const content = res.getContent(req.controller + '/index', {
                rssMain: rssMain,
                rssSources: rssSources,
            });
            res.render('index', {
                content: content,
                css: [],
                js: []
            });
        },
    }
}