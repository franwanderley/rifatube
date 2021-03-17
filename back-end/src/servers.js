"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_1.default.json()); // Para entender json
app.use(cors_1.default());
app.use(routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '..', 'uploads'))); //Usa uma rota para que a imagem possa ser usado
app.listen(process.env.PORT || 3333);
