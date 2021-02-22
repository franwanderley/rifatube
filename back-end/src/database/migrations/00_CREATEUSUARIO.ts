import Knex from 'knex';

export async function up(knex : Knex){
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

export async function down(knex : Knex){
    //Voltar atras(deletar a tabela)
    knex.schema.dropTable('usuario');//deletar toda a tabela
}

