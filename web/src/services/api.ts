import Axios from 'axios';

//Quando for fazer o deploy do back muda aqui
const api = Axios.create({
    baseURL : process.env.REACT_APP_HOST
});

export default api;