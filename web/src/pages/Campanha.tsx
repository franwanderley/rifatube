import React, {useEffect, useState} from 'react';
import Header from '../components/header';
import {useHistory, Link} from 'react-router-dom';
import Footer from '../components/footer';
import api from './../services/api';
import './../styles/campanha.css';
import swal from 'sweetalert';
import Cripto from './../services/CryptoConfig';

interface Props{
    match : {
        params: {
            id : number
        }
    }
}
interface CampanhaInterface{
    id          : number;
    produto     : string;
    imagem      : string;
    datasorteio : string;
    qtdmax      : number;
    qtd         : number;
    situacao    : string;
    preco       : number;
    idCriador   : number;
}
interface RifaInterface{
    id         : number;
    idusuario  : number;
    idcampanha : number;
    situacao   : string;
    data       : string;
    numero     : number;

}
interface NumeroInterface{
    numero : string;
    cor    : string;

}

function Campanha(props : Props){

    function GetColumn(props : {value : NumeroInterface}){
        if(props.value.cor === "vermelho")
            return <td key={props.value.numero} className="td vermelho"> {props.value.numero}</td>
        else if(props.value.cor === "cinza")
            return <td key={props.value.numero}  onClick={() => onSelected(props.value.numero)} className="td cinza"> {props.value.numero}</td>
        else if(props.value.numero !== '000')
            return <td key={props.value.numero} onClick={() => onSelected(props.value.numero)} className="td">{props.value.numero}</td>
        else
            return <td className="td1">{props.value.numero}</td>
    }
    function GetTable(props : {numero : NumeroInterface[]}){
        return (
            <table className="items-grid">
                {props.numero.map(n => (
                    <GetColumn value={n}/>
                     
                ))}
            
            </table>
        );
    }

    function comprar(){
        if(numerosSelected.length >= 1){
            const requisicao = {numeros : numerosSelected,total : total * Number(campanha?.preco), campanhaId : campanha?.id, usuarioId : sessionStorage.getItem('rifatube/id')}
            history.push("/comprar",requisicao);
        }
        else{
            swal({title : "Escolha um Numero!", icon : "warning"});
            return;
        }
    }

    function criarButtao(situacao : string | undefined){
        if(situacao === "Finalizado")
           return <button className="final" onClick={comprar} disabled>Campanha Finalizada</button>
        else
            return <button className="compra" onClick={comprar}>Finalizar Compra</button>

    }

    function onSelected(n : string){
        if(numerosSelected.includes(n)){//Se o id tiver sido selecionado vai ser desmarcado
            setTotal(total-1)
            const itemsfiltrados = numerosSelected.filter(numero => numero !== n);//vai tirar o item com este id
            setNumerosSelected(itemsfiltrados);
        }
        else{
            setNumerosSelected( [ ...numerosSelected, n ] );
            setTotal(total+1);
        }
    }

    const history = useHistory();
    const [numeros,setNumeros] = useState<NumeroInterface[]>([]);
    const [total, setTotal]  = useState<number>(0);
    const [numerosSelected, setNumerosSelected] = useState<string[]>([]);
    const [campanha, setCampanha] = useState<CampanhaInterface>();
    const [rifas, setRifas] = useState<RifaInterface[]>();

    //Vai mudar
    useEffect( () => {
        api.get('rifa?idc=' + campanha?.id).then(res => {
            setRifas(res.data);
            console.log(res.data);
        }).catch(error => { 
            setRifas(undefined);
        });
    },[campanha]);
    useEffect(()=>{
         function getParams(){
            let id : string;
            id =  Cripto.descriptografar( String( props.match.params.id ));
            sessionStorage.setItem('rifatube/idcampanha',id);
            console.log("Id = "+id);
             if(id)
                 api.get('campanha/'+ id).then(res =>{
                     setCampanha(res.data);
                 });
        }
        const session = sessionStorage.getItem('rifatube/id');
        if(session)
            getParams();
        else
            history.push('/login');
     },[props]);
     useEffect(() => {
        function getNumero(){
            let aux: NumeroInterface[] = [];
            const x = campanha?.qtdmax || 0;
            for(let i = 1; i <= 100; i++){
                //Definir a cor
                let cor = 'branco';
                if(rifas?.find(rifa => { return rifa.numero === i}))
                    cor = "vermelho";
                if(numerosSelected?.find(n => { return Number(n) === i}))
                    cor = "cinza";

                if(i > x)
                    aux.push({numero :"000", cor: cor});
                else if(i < 10)
                    aux.push({numero :'00'+ i, cor: cor});
                else
                    aux.push({numero :'0'+ i, cor: cor});

    
            }
            setNumeros(aux);
        }
        getNumero();
     }, [campanha,rifas,numerosSelected]);

    return(
        <div className="container">
            <Header />
            <div className="campanha">
                <div className="aside">
                    <h3>{campanha?.produto}</h3>
                    <img src={campanha?.imagem} alt={campanha?.produto}/>
                    <progress max={campanha?.qtdmax} value={campanha?.qtd}></progress>
                    <p className="preco" >{"R$ "+ campanha?.preco}</p>
                </div>
                <div className="section">
                    <div className="rifas">
                        <p className="data">Término:{campanha?.datasorteio}</p>
                        <GetTable numero={numeros}/>
                       <div className="details">
                            <div className="cor1"></div> <p>Disponivel</p>     
                            <div className="cor2"></div> <p>Selecionada</p>
                            <div className="cor3"></div> <p>Comprada</p>
                        </div>
                        <p className="total">Total: R$ {total * Number(campanha?.preco) }</p>
                        {criarButtao(campanha?.situacao)}
                    </div>
                    <div className="regra">

                    </div>
                    <div className="ganhador">

                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Campanha;