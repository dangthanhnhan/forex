module.exports = function(app, options) {
    return function(req, res, next) {
        if (typeof req.body !== 'undefined') {
            req.body = JSON.parse(JSON.stringify(req.body)); // To fix hasOwnProperty
        }
        const getDataRender = function(data) {
            data = data || {};
            data.module = req.module;
            data.controller = req.controller;
            data.action = req.action;
            data.assetsUrl = '/assets/' + req.module + '/';
            data.includeHeader = typeof data.includeHeader !== 'undefined' ? data.includeHeader : true;
            data.includeFooter = typeof data.includeFooter !== 'undefined' ? data.includeFooter : true;

            if (data.module == 'site') {
                const rssFeatureSources = [
                    {
                        name: 'Thể thao',
                        link: 'http://www.24h.com.vn/upload/rss/thethao.rss',
                    },
                    {
                        name: 'Khoa học',
                        link: 'https://vnexpress.net/rss/khoa-hoc.rss',
                    },
                ];
                data.rssFeatureSources = rssFeatureSources;
            }

            return data;
        };

        const curRender = res.render;
        res.render = function(path, locals, func) {
            locals = getDataRender(locals);

            if (!req.isAsset) {
                var config = app.get('config');
                var session = req.session;

                locals.config = {
                    rooturl: config.rooturl,
                    rooturl_module: config.rooturl + '/' + locals.module
                };
                locals.session = session;
            }
            if (path && path != '') {
                if (locals.controller == 'login') {
                    path = req.module + '/' + req.controller + '/' + path;
                } else {
                    if (path != 'error') {
                        if (path == 'notfound') {
                            path = req.module + '/' + path;
                        } else {
                            locals.page = req.module + '/' + req.controller + '/' + path;
                            locals.filname = req.module + '/' + req.controller + '/' + path;
                            path = req.module + '/index';
                        }
                    }
                }
                console.log('main view path: ' + path);
                var args = [path, locals, func];
                curRender.apply(this, args);
            }
        };

        res.getContent = function(path, data, options) {
            options = options || {};
            data = getDataRender(data);

            const config = app.get('config');
            data.config = {
                rooturl: config.rooturl,
                rooturl_module: config.rooturl + '/' + data.module
            };

            path = app.rootDir + '/views/' + req.module + '/' + path + '.ejs';
            console.log('controller view path: ' + path);
            const ejs = require('ejs');
            let content = '';
            ejs.renderFile(path, data, options, function(err, str){
                content = str;
            });

            return content;
        };

        next();
    };
}