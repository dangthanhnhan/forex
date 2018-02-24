var config = {
    local: {
        rooturl: "http://localhost:3000",
        database: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            name: 'forex',
            table_prefix: 'lit_'
        },
        session: {
            secret: 'abc',
            cookie: {}
        },
        mailer: {
            host: 'smtp.gmail.com',
            username: 'dtnhan.it@gmail.com',
            password: 'fgcepngvhbznwuph',
            port: 465,
            ssl: true,
            from_email: 'dtnhan.it@gmail.com',
            from_address: 'Forex'
        }
    },
    development: {
        rooturl: "http://portal.traderviet.com",
        database: {
            host: '103.3.62.35',
            user: 'forex',
            password: '9$FQQ!E*,YUv',
            name: 'forex',
            table_prefix: 'lit_'
        },
        session: {
            secret: 'abc',
            cookie: {}
        },
        mailer: {
            host: 'smtp.gmail.com',
            username: 'dtnhan.it@gmail.com',
            password: 'fgcepngvhbznwuph',
            port: 465,
            ssl: true,
            from_email: 'dtnhan.it@gmail.com',
            from_address: 'Forex'
        }
    },
    production: {
        rooturl: "http://portal.traderviet.com",
        database: {
            host: 'localhost',
            user: 'root',
            password: '9$FQQ!E*,YUv',
            name: 'forex',
            table_prefix: 'lit_'
        },
        session: {
            secret: 'abc',
            cookie: {}
        },
        mailer: {
            host: 'smtp.gmail.com',
            username: 'dtnhan.it@gmail.com',
            password: 'fgcepngvhbznwuph',
            port: 465,
            ssl: true,
            from_email: 'dtnhan.it@gmail.com',
            from_address: 'Forex'
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}