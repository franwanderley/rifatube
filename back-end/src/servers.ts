import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(express.json()); // Para entender json

app.use(cors());

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));//Usa uma rota para que a imagem possa ser usado


app.listen(process.env.PORT || 3333);