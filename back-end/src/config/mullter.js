"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer")); //biblioteca para upload de arquivos
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto")); //Para gerar nome para imagem
exports.default = {
    storage: multer_1.default.diskStorage({
        destination: path_1.default.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto_1.default.randomBytes(6).toString('hex'); //gerar 6 caracteres em hexadecimal
            const filename = `${hash}-${file.originalname}`; //hash mais o nome original
            callback(null, filename); //Param erro, nome do arquivo
        }
    }),
};
/*===========Arquivo para upload de arquivos=========== */ 
