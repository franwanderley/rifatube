import Knex from 'knex';

export async function up(knex : Knex){
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

export async function down(knex : Knex){
    //Voltar atras(deletar a tabela)
    knex.schema.dropTable('rifa');//deletar toda a tabela
}

