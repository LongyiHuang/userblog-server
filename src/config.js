module.exports = {
    redis:{
        development:{
            ip:'127.0.0.1',
            port:'6379',
        },
        production:{
            ip:'192.168.0.124',
            port:'6380',
            auth:'0'
        }
    },

    mysql:{
        development: {
            client: 'mysql',
            connection: {
                host : '127.0.0.1',
                user : 'root',
                password : '123456',
                database : 'crud',
                charset: 'utf8',
            },
            migrations: {
                tableName: 'knex_migrations'
            }
        },

        production: {
            client: 'mysql',
            connection: {
                host : '192.168.0.124',
                user : 'work',
                password : '123456',
                database : 'xiaobailong',
                charset: 'utf8',
            },
            pool: {
                min: 2,
                max: 10
            },
            migrations: {
                tableName: 'knex_migrations'
            }
        }
    },

    AES_KEY : 'baizeyiqihudong1',
    IV : 'baizeyiqihudong1',
    JWT_SECRET : 'thisissecretforjsonwebtoken',
}
