
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('user', function(table) {
            table.increments('id').primary();
            table.string('username',64).notNullable().unique();
            table.string('email',64).notNullable().unique();
            table.string('password_digest').notNullable();
            table.timestamps();
        }),
        knex.schema.createTableIfNotExists('article', function(table) {
            table.increments('id').primary();
            table.string('title',255).notNullable();
            table.text('content');
            table.timestamps();
        }),
        knex.schema.createTableIfNotExists('todo', function(table) {
            table.increments('id').primary();
            table.string('item',64).notNullable();
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('user'),
        knex.schema.dropTable('article'),
        knex.schema.dropTable('todo')
    ]);
};
