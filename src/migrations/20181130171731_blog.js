
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('user', function(table) {
            table.renameColumn('username', 'account');
        }),
        knex.schema.alterTable('article', function(table) {
            table.string('author', 64);
        }),
    ])

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('user', function(table) {
            table.renameColumn('account', 'username');
        }),
        knex.schema.alterTable('article', function(table) {
            table.dropColumn('author');
        }),
    ]);
};
