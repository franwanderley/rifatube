import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import swal from 'sweetalert';
import Cripto from './../services/CryptoConfig';
import api from './../services/api';
import Header from '../components/header';
import Footer from '../components/footer';
import './../styles/campanha.css';

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
    idcriador   : number;
    idganhador  : number;
}
interface Usuario{
    nome      : string;
    sobrenome : string;
    foto    : string;

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
        switch(props.value.cor){
            case "vermelho" : 
                return <td key={props.value.numero} className="td vermelho"> {props.value.numero}</td>
            case "cinza" :
                return <td key={props.value.numero}  onClick={() => onSelected(props.value.numero)} className="td cinza"> {props.value.numero}</td>
            case "sem cor" :
                return <td key={props.value.numero} className="td semcor">{props.value.numero}</td>                
            default :{ 
                console.log('default');
                return <td className="td1" onClick={() => onSelected(props.value.numero)} key={props.value.numero}>{props.value.numero}</td>
            }
        }
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
            const requisicao = {
                numeros : numerosSelected,
                total : total * Number(campanha?.preco), 
                campanhaId : campanha?.id,
                usuarioId : sessionStorage.getItem('rifatube/id')
            }
            history.push("/comprar",requisicao);
        }
        else{
            swal({title : "Escolha um Numero!", icon : "warning"});
            return;
        }
    }

    function onSelected(n : string){
        //Se o id tiver sido selecionado vai ser desmarcado
        if(numerosSelected.includes(n)){
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
    const [usuario, setUsuario] = useState<Usuario>();
    const [rifas, setRifas] = useState<RifaInterface[]>();

    //Descriptografar param e buscar a campanha
    useEffect(()=>{
        function getParams(){
           const idcrypto = String(props.match.params.id);
           let id : string =  Cripto.descriptografar( idcrypto );
           console.log("Id = "+id);
            if(id)
                api.get('campanha/'+ id).then(res =>{
                    setCampanha(res.data);
                }).catch(error => {
                    swal({title: "Campanha não encontrado!",text : String(error), icon : "warning"});
                });
       }
       //Verificar se estar logado!
       const session = sessionStorage.getItem('rifatube/id');
       if(session)
           getParams();
       else
           history.push('/login');
    },[props]);

    //Buscar rifa por campanha
    useEffect( () => {
        api.get('rifa?idc=' + campanha?.id).then(res => {
            setRifas(res.data);
            console.log(res.data);
        }).catch(error => { 
            setRifas(undefined);
        });
    },[campanha]);

    //Buscar Usuario ganhador
    useEffect(() => {
        async function pegarGanhador () {
            const user = await api.get(`users/${campanha?.idganhador}`).then(res => {
                return res.data as Usuario;
            }).catch(error => undefined);
            setUsuario(user);
        }
        pegarGanhador();
    }, [campanha]);

     //Ajeitar os numeros e definir suas cores
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
                    aux.push({numero :"000", cor: "sem cor"});
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
                    {usuario && 
                    <div className="ganhador">
                        <h3>Ganhador</h3>
                        <div>
                            <img src={`${process.env.REACT_APP_HOST}uploads/${usuario?.foto}`} alt="ganhador"/>
                            <p>{usuario?.nome} {usuario?.sobrenome}</p>
                        </div>
                    </div>
                    }
                    <div className="rifas">
                        <p className="data">Término: {campanha?.datasorteio}</p>
                        <GetTable numero={numeros}/>
                       <div className="details">
                            <div className="cor1"></div> <p>Disponivel</p>     
                            <div className="cor2"></div> <p>Selecionada</p>
                            <div className="cor3"></div> <p>Comprada</p>
                        </div>
                        <p className="total">Total: R$ {total * Number(campanha?.preco) }</p>
                        { (campanha?.situacao === "Finalizado") ?
                            <button className="final" onClick={comprar} disabled>Campanha Finalizada</button>
                        :
                            <button className="compra" onClick={comprar}>Finalizar Compra</button>
                        }
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Campanha;