exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('session', function(table) {
            table.increments('id').primary();
            table.string('session',100).notNullable().unique();
            table.text('public_key').notNullable();
            table.text('primary_key').notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('session'),
    ]);
};
