import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../services/api';
import Header from '../components/header';
import Footer from '../components/footer';
import "./../styles/createcampanha.css";

function CreateCampanha() {

    const [produto, setProduto] = useState("");
    const [imagem, setImagem] = useState("");
    const [datasorteio, setDate] = useState("");
    const [qtdmax, setQtdmax] = useState(0);
    const [preco, setPreco] = useState(0);
    const history = useHistory();

    function getHoje() {
        const day = (new Date()).toLocaleDateString();
        const date = day.split('/');
        const dateformat = date.reverse().join('-');
        return dateformat;
    }

    function redirecionar(){
        history.push('/');
    }

    function handleData(event : ChangeEvent<HTMLDataElement>){
        const aux = event.target.value;
        const dateFormart = aux.split('-').reverse().join("/");
        console.log(dateFormart);   
        setDate(dateFormart);
    }

    async function onSave(event : FormEvent<HTMLFormElement>){
        event.preventDefault();
        const idCriador = sessionStorage.getItem('rifatube/id');
        const data = {
         produto, imagem, datasorteio,qtdmax, preco, qtd : 0, situacao : "aberto", idCriador 
        };
        await api.post('campanha',data)
        .then(res => swal({title: "Campanha salvo com successo", icon: "success"}))
        .catch(() => swal({title : "A campanha não foi salvo", icon : "warning"}));
    }

    useEffect(() => {
        const session = sessionStorage.getItem('rifatube/id');
        if(! session)
            redirecionar();
    }, [redirecionar]);

    return (
       <div className="container">
            <Header />
            <div className="createcampanha">
                <form onSubmit={onSave} className="form-campanha">
                <h3>Criar Campanha</h3>
                <div className="divnome">
                    <label htmlFor="produto">Nome</label>
                    <input 
                        type="nome" 
                        id="produto" 
                        onChange={e => setProduto(e.target.value)} 
                        required 
                        minLength={5}
                    />
                </div>
                <div className="divurl">
                    <label htmlFor="url">Image(URL)</label>
                    <input
                        type="text" 
                        id="url"
                        onChange={e => setImagem(e.target.value)}
                        required
                    />
                </div>
                <div className="divdata">
                    <label htmlFor="datasorteio">Data Final</label>
                    <input 
                        type="date" 
                        id="datasorteio" 
                        min={getHoje()}  
                        onChange={handleData} 
                        required
                    />
                </div>
                <div className="juntos">
                    <div className="divqtdmax">
                        <label htmlFor="qtdmax">Quantidade de Rifas</label>
                        <input 
                            type="number"
                            id="qtdmax"
                            onChange={e => setQtdmax(Number(e.target.value))} 
                            min={2} 
                            required
                        />
                    </div>
                    <div className="divpreco">
                        <label htmlFor="preco">Preço</label>
                        <input 
                            type="number" 
                            id="preco" 
                            onChange={e => setPreco(Number(e.target.value))} 
                            min={1}
                            required
                        />
                    </div>
                </div>

               <div className="btn">
                <button type="submit" className="btn-entrar">Adicionar Campanha</button>
               </div>
            </form>
            </div>
            <Footer/>
       </div>
    );
}
export default CreateCampanha;