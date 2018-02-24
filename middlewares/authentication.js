module.exports = function(app, options) {
    return async function(req, res, next) {
        if (!req.isAsset) {
            const UserModel = require(app.rootDir + '/models/user')(req.db, app);
            var module = req.module;
            var controller = req.controller;
            var session = req.session;
            var uid = session.uid ? parseInt(session.uid) : 0;
            var err = null;
            if (uid == 0) {
                if (module == 'admin' && controller != 'login' && controller != 'rss') {
                    err = new Error('Unauthorization');
                    err.status = 401;
                }
            } else {
                await UserModel.updateFromSession(session);
                if (module == 'admin' && controller == 'login') {
                    res.redirect('/admin/index');
                    return;
                }
            }

            req.isAdmin = function() {
                console.log('=========== is admin =============');
                console.log(session.groupid);
                console.log(UserModel.GROUP_ADMIN);
                return session.groupid == UserModel.GROUP_ADMIN;
            }

            next(err);
        } else {
            next();
        }
    };
}