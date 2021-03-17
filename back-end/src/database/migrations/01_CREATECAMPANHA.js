"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    //Criar tabela usuario
    return knex.schema.createTable('campanha', table => {
        table.increments('id').primary();
        table.string('produto').notNullable();
        table.string('imagem').notNullable();
        table.string('datasorteio').notNullable();
        table.string('qtdmax').notNullable();
        table.string('qtd').notNullable();
        table.string('situacao').notNullable();
        table.integer('idcriador').notNullable().references('id').inTable('usuario');
        table.integer('idganhador').nullable().references('id').inTable('usuario');
        table.integer('preco').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    //Voltar atras(deletar a tabela)
    knex.schema.dropTable('campanha'); //deletar toda a tabela
}
exports.down = down;
