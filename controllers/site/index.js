'use strict';
module.exports = function(app){
    return {
        index: function(req, res, next) {
            const rssMain = {
                name: 'Forex - Commodities',
                link: 'https://traderviet.com/forums/thi-truong-forex-commodities.9/index.rss'
            };
            const rssSources = [
                {
                    name: 'Kinh tế - tài chính',
                    link: 'https://traderviet.com/forums/kien-thuc-kinh-te-tai-chinh.74/index.rss',
                },
                {
                    name: 'Price Action',
                    link: 'https://traderviet.com/forums/lop-hoc-price-action.6/index.rss',
                },
                {
                    name: 'Binary Options',
                    link: 'https://traderviet.com/forums/quyen-chon-nhi-phan-binary-options.66/index.rss',
                },
                {
                    name: 'Forex',
                    link: 'https://traderviet.com/forums/thi-truong-forex-commodities.9/index.rss',
                },
                {
                    name: 'Crypto Currency',
                    link: 'https://traderviet.com/forums/thi-truong-tien-dien-tu-crypto-currency.54/index.rss',
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