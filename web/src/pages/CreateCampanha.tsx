import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import api from '../services/api';
import "./../styles/createcampanha.css";
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

function CreateCampanha(){

    function getHoje() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear()
        let formatterDay;	
        if (day < 10) {
            formatterDay = '0'+ day;
        } else {
            formatterDay = day;
        }
 
        let formatterMonth;	
        if (month < 10) {
            formatterMonth = '0'+ month;
        } else {
            formatterMonth = month;
        }
        const x = (year + '-' + formatterMonth + '-' + formatterDay);
        return x;
    }

     //Vai salvar os inputs ao escrever
     function handleProduto(event : ChangeEvent<HTMLInputElement>){
        //console.log(event.target.value);   
        const aux = event.target.value;//Vai guarda o nome do input e o valor
        setProduto(aux);//Tá pegando a mesma expressão,pega cada atributo e muda
    }
     function handleImagem(event : ChangeEvent<HTMLInputElement>){
         //console.log(event.target.value);   
         const aux = event.target.value;//Vai guarda o nome do input e o valor
         setImagem(aux);//Tá pegando a mesma expressão,pega cada atributo e muda
    }
     function handleData(event : ChangeEvent<HTMLDataElement>){
          //console.log(event.target.value);   
          const aux = event.target.value.toLocaleString();//Vai guarda o nome do input e o valor
          setDate(aux);//Tá pegando a mesma expressão,pega cada atributo e muda
    }
     function handleQtdMax(event : ChangeEvent<HTMLInputElement>){
         //console.log(event.target.value);   
        const aux = Number(event.target.value);
        setQtdmax(aux);//Tá pegando a mesma expressão,pega cada atributo e muda
    }
     function handlePreco(event : ChangeEvent<HTMLInputElement>){
          const aux = Number(event.target.value);//Vai guarda o nome do input e o valor
          setPreco(aux);//Tá pegando a mesma expressão,pega cada atributo e muda
    }
    async function onSave(event : FormEvent<HTMLFormElement>){
        event.preventDefault();//Para não atualizar a pagina ao enviar
        const idCriador = sessionStorage.getItem('rifatube/id');
        //Formatar Datas
        const arrdate = datasorteio.split('-').reverse();
        const datFormat = arrdate.join('/');
        setDate(datFormat)
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
            history.push('/login');
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