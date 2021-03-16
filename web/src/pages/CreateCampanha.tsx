import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../services/api';
import Header from '../components/header';
import Footer from '../components/footer';
import "./../styles/createcampanha.css";

function CreateCampanha(){

    //Pegar hoje no formato yyyy-mm-dd
    function getHoje() {
        let teste = (new Date()).toLocaleDateString(); //toLocaleDateString
        let date = teste.split('/');
        const dateformat = date.reverse().join('-');
        return dateformat;
    }
    function redirecionar(){
        history.push('/');
    }
     //Vai salvar os inputs ao escrever
    function handleProduto(event : ChangeEvent<HTMLInputElement>){
        setProduto(event.target.value);
    }
    function handleImagem(event : ChangeEvent<HTMLInputElement>){
        setImagem(event.target.value);
    }
    function handleData(event : ChangeEvent<HTMLDataElement>){
        const aux = event.target.value;
        //Transformar yyyy-mm-dd para dd/mm/yyyy
        const dateFormart = aux.split('-').reverse().join("/");
        console.log(dateFormart);   
        setDate(dateFormart);
    }
    function handleQtdMax(event : ChangeEvent<HTMLInputElement>){
        setQtdmax(Number(event.target.value));
    }
    function handlePreco(event : ChangeEvent<HTMLInputElement>){
        setPreco(Number(event.target.value));
    }
    async function onSave(event : FormEvent<HTMLFormElement>){
        event.preventDefault();//Para não atualizar a pagina ao enviar
        const idCriador = sessionStorage.getItem('rifatube/id');
        //Formatar Datas
        const data = {
         produto, imagem, datasorteio,qtdmax, preco, qtd : 0, situacao : "aberto", idCriador 
        };
        
        try{
            const x = await api.post('campanha',data);//Vai conectar com o BACK_END e enviar informações do form 
            if(x.data){
                swal({title: "Campanha salvo com successo", icon: "success"});
            }else
                swal({title : "A campanha não foi salvo", icon : "warning"});
         }catch(error){
            swal({title : "Erro no Formulario", text : String(error) , icon : "warning"});
         }
    }

    const [produto, setProduto] = useState("");
    const [imagem, setImagem] = useState("");
    const [datasorteio, setDate] = useState("");
    const [qtdmax, setQtdmax] = useState(0);
    const [preco, setPreco] = useState(0);
    const history = useHistory();

    useEffect(() => {
        const session = sessionStorage.getItem('rifatube/id');
        if(! session)
            redirecionar();
    }, []);

    return (
       <div className="container">
            <Header />
            <div className="createcampanha">
                <form onSubmit={onSave} className="form-campanha">
                <h3>Criar Campanha</h3>
                <div className="divnome">
                    <label htmlFor="produto">Nome</label>
                    <input type="nome" id="produto" onChange={handleProduto} required minLength={5}/>
                </div>
                <div className="divurl">
                    <label htmlFor="url">Image(URL)</label>
                    <input type="text" id="url" onChange={handleImagem} required/>
                </div>
                <div className="divdata">
                    <label htmlFor="datasorteio">Data Final</label>
                    <input type="date" id="datasorteio" min={getHoje()}  onChange={handleData} required/>
                </div>
                <div className="juntos">
                    <div className="divqtdmax">
                        <label htmlFor="qtdmax">Quantidade de Rifas</label>
                        <input type="number" id="qtdmax" onChange={handleQtdMax} min={2} required/>
                    </div>
                    <div className="divpreco">
                        <label htmlFor="preco">Preço</label>
                        <input type="number" id="preco" onChange={handlePreco} min={1} required/>
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