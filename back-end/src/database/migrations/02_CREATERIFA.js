"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    //Criar tabela usuario
    return knex.schema.createTable('rifa', table => {
        table.increments('id').primary();
        table.integer('idusuario').notNullable().references('id').inTable('usuario');
        table.integer('idcampanha').notNullable().references('id').inTable('campanha');
        table.string('situacao').notNullable();
        table.string('data').nullable();
        table.integer('numero').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    //Voltar atras(deletar a tabela)
    knex.schema.dropTable('rifa'); //deletar toda a tabela
}
exports.down = down;
