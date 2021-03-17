"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
//E aqui onde faço a conexão com o BD
module.exports = {
    client: 'sqlite3',
    connection: {
        //Onde o banco de dados
        filename: path_1.default.resolve(__dirname, "src", 'database', 'database.sqlite'),
    },
    migrations: {
        //Onde crio querybuilds para criar as tabelas
        directory: path_1.default.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
        //Onde crio querybuilds para inserir no banco
        directory: path_1.default.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
};
// para depois executar npx knex migrate:latest --knexfile knexfile.ts migrate:latest
