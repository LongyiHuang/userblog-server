
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('article', function(table) {
            table.dropTimestamps();
        }),
        knex.schema.alterTable('article', function(table) {
            table.timestamps(3,3);
        }),
        knex.schema.alterTable('article', function(table) {
            table.string("description",255);
        }),
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('article', function(table) {
            table.dropTimestamps();
        }),
        knex.schema.alterTable('article', function(table) {
            table.timestamps();
        }),
        knex.schema.alterTable('article', function(table) {
            table.dropColumn("description");
        }),
    ])
};
