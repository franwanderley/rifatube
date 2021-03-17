"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const conection = knex_1.default({
    client: 'sqlite3',
    connection: {
        //Onde o BD está
        filename: path_1.default.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});
exports.default = conection;
