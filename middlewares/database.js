const Sequelize = require('sequelize');

module.exports = function(app, options) {
    return function(req, res, next) {
        let err = null;
        if (!req.isAsset) {
            const config = app.get('config');
            const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
                host: config.database.host,
                dialect: 'mysql',
                define: {
                    charset: 'utf8',
                    dialectOptions: {
                        collate: 'utf8_general_ci'
                    },
                    timestamps: true
                },
                pool: {
                    max: 20,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                timezone: 'Asia/Ho_Chi_Minh'
            });
            sequelize
                .authenticate()
                .then(() => {
                    req.db = sequelize;
                    next();
                })
                .catch(error => {
                    err = error;
                    next(err);
                });
            app.req = req;
        } else {
            next();
        }
    };
}