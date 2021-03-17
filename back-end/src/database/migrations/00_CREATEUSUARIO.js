"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    //Criar tabela usuario
    return knex.schema.createTable('usuario', table => {
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('senha').notNullable();
        table.string('nome').notNullable();
        table.string('sobrenome').notNullable();
        table.string('endereco').notNullable();
        table.string('telefone').notNullable();
        table.string('foto').nullable();
        table.boolean('influenciador').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    //Voltar atras(deletar a tabela)
    knex.schema.dropTable('usuario'); //deletar toda a tabela
}
exports.down = down;
