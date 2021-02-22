import Axios from 'axios';

//Quando for fazer o deploy do back muda aqui
const api = Axios.create({
    baseURL : 'https://rifatubebackend.herokuapp.com/'
    // REMOTE : https://rifatubebackend.herokuapp.com/
    // LOCAL  : http://localhost:3333/
});

export default api;