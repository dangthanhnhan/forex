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
        
    },
    production: {

    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}