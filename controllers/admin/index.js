'use strict';
module.exports = function(app){
    return {
        index: function(req, res, next) {
            const content = res.getContent(req.controller + '/index');
            res.render('index', {
                content: content,
                css: ['vendors/custom/fullcalendar/fullcalendar.bundle.css'],
                js: [
                    'vendors/custom/fullcalendar/fullcalendar.bundle.js',
                    'js/dashboard.js'
                ]
            });
        },
    }
}