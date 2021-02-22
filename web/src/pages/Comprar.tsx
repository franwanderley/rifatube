import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Header from './../components/header';
import Footer from './../components/footer';
import './../styles/comprar.css';
import {FaCreditCard, FaMoneyCheckAlt, FaBarcode, FaPrint, FaCalendarAlt, FaMoneyBillAlt} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import api from '../services/api';
import swal from 'sweetalert';
import Cripto from '../services/CryptoConfig';
interface Props{
    location : {
        state : {
            numeros    : number[];
            total      : number;
            campanhaId : number;
            usuarioId  : number;
        };
    };
}
interface Usuario{
  id            : number;
  nome          : string;
  email         : string;
  senha         : string;
  sobrenome     : string 
  endereco      : string
  telefone      : string;
  influenciador : boolean;
}
interface Campanha {
  id          : number;
  produto     : string;
  imagem      : string;
  datasorteio : string;
  qtdmax      : number;
  qtd         : number;
  situacao    : string;
  preco       : number;
  idcriador   : number;
}
interface Endereco {
  cep : string;
  logradouro : string;
  bairro : string;
  localidade : string;
  uf : string;
}

function Comprar(props : Props){

    function redirecionar(){
      history.push("/login");
    }
    function getHoje() {
      let date = new Date()
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
  
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
      const x = (formatterDay + '/' + formatterMonth + '/' + year);
      console.log(x);
      return x;
  }
    function aba1(){
      setAba(0);
    }
    function aba2(){
      setAba(1);
    }
    function aba3(){
      setAba(2);
    }
    function classAba(param : Number){
        if(aba === param){
          return "abrir"
        }
        else
          return "";
    }
    function handleNumeroCartao(event : ChangeEvent<HTMLInputElement>){
      setNumeroCartao(event.target.value);
    }
    function handleNomeCartao(event : ChangeEvent<HTMLInputElement>){
      setNomeCartao(event.target.value);
    }
    function handleValidade(event : ChangeEvent<HTMLInputElement>){
      setValidade(event.target.value);
    }
    function handleCodigo(event : ChangeEvent<HTMLInputElement>){
      setCodigo(event.target.value);
    }
    function handleCep(event : ChangeEvent<HTMLInputElement>){
      setCep(event.target.value);
    }
    function handleNumeroCasa(event : ChangeEvent<HTMLInputElement>){
      const numero = Number(event.target.value);
      setNumeroCasa(numero);
    }
    function handleDocumentType(event : ChangeEvent<HTMLSelectElement>){
        setDocumentType(event.target.value);
    }
    function handleDocumentNumber(event : ChangeEvent<HTMLInputElement>){
        setDocumentNumber(event.target.value);
    }
     async function onPayCC(event : FormEvent){
       event.preventDefault();
      try {
        const usuarioId  = props.location.state.usuarioId;
        const campanhaId = props.location.state.campanhaId;
        const total      = props.location.state.total;

        const body = {usuarioid : usuarioId, campanhaid : campanhaId, total : total * 100, numerocartao : numeroCartao, nomecartao : nomeCartao, validade, codigo};
        const status = await api.post('credito', body).then(res => {
          return res.data;
        });
        if(status === "APPROVED"){
          //Criar Rifas
          props.location.state.numeros.map(numero => {
            const data = getHoje();
            const rifa = {idusuario : usuarioId, idcampanha : campanhaId, situacao : "pago", data, numero};
            const id = api.post('rifa', rifa).then(res => {
              return res.data;
            });
            console.log('id cadastrado'+ id);
            
          });
          swal({title:"Pagamento feito com Sucesso!", icon: 'success'});
          const camp = Cripto.criptografar(String(campanhaId));
          history.push('/campanha/'+ camp);
        }
        else{
          swal({title:"Pagamento não Efetuado!", icon: 'warning'});
        }
      } catch (error) {
        swal({title:"Algo deu Errado no Pagamento", text: error, icon: "warning"})
      }
    }
    function onPayDB(){
      return;
    }
    async function onPayBB(event : FormEvent){
      event.preventDefault();
      const data = {nome : sessionStorage.getItem('rifatube/nome'), usuarioid : props.location.state.usuarioId, campanhaid : props.location.state.campanhaId, total : props.location.state.total,documentType,documentNumber, cep, logradouro : endereco?.logradouro, numeroCasa, bairro : endereco?.bairro, localidade : endereco?.localidade, uf : endereco?.uf};
      //console.log(data);
      const boleto = await api.post('boleto', data).then((res : {data: {status: string, link:string; pagar_id : string}}) => { 
        return res.data;
      });
      console.log("Payment_id "+ boleto.pagar_id);
      if(boleto.status === "APROVED"){
        
        props.location.state.numeros.map(numero => {
          const data = getHoje();
          const rifa = {idusuario : props.location.state.usuarioId, idcampanha : props.location.state.campanhaId, situacao : "pendente", data, numero, payment_id : boleto.pagar_id, link_boleto : String(boleto.link)};
          const id = api.post('rifa', rifa).then(res => {
            return res.data;
          });
          //console.log('id cadastrado'+ id);
          
        });
        swal({title: "Boleto Gerado com Sucesso", icon : "success"}).then(() => window.location.href = String(boleto.link) );
        const camp = Cripto.criptografar(String(props.location.state.campanhaId));
        //history.push('/campanha/'+ camp);
      }else
        swal({title: "Pagamento não realizado!", icon: "warning"});
    }

    const history = useHistory();
    const [aba, setAba] = useState<Number>(0);
    const [usuario, setUsuario] = useState<Usuario>();
    const [campanha, setCampanha] = useState<Campanha>();
    const [endereco, setEndereco] = useState<Endereco>();
    const [numeroCartao, setNumeroCartao] = useState<string>("");
    const [nomeCartao, setNomeCartao] = useState<string>("");
    const [validade, setValidade] = useState<string>("");
    const [codigo, setCodigo] = useState<string>();
    const [cep, setCep] = useState<string>("");
    const [numeroCasa, setNumeroCasa] = useState<number>();
    const [documentType, setDocumentType] = useState<string>("CPF");
    const [documentNumber,setDocumentNumber] = useState<string>("");
 
    useEffect(()=> {
      async function pegarDados(){
        const idu = props.location.state.usuarioId;
        if(idu){
          await api.get('users/'+ idu).then(res => {
            setUsuario(res.data);
          });
        }
        const idc = props.location.state.campanhaId;
        if(idc){
          await api.get('campanha/'+ idc).then(res => {
            setCampanha(res.data);
          });
        }

      }
      if(sessionStorage.getItem("rifatube/id"))
        pegarDados();
      else
        redirecionar();
    }, [props]);

    useEffect(() => {
      async function pegarEndereco(){
        await Axios.get('https://viacep.com.br/ws/'+ cep +'/json/').then(res => {
          setEndereco(res.data);
        }).catch(error => {
          console.log(error);
        });
      }
      pegarEndereco();
    }, [cep]);

    return (
    <div className="container">
        <Header/>
        <div className="comprar">
        <div className="headerpay">
        <h1>Selecione o tipo de pagamento</h1>
        <p className="total">Total : R$ {props.location.state.total}</p>
        </div>
        <ul className="menu">
          <li onClick={aba1} className={"opcoes "+ classAba(0)}>< FaCreditCard/> <br/> Cartão de Credito </li>
          <li onClick={aba2} className={"opcoes "+ classAba(1)}> <FaMoneyCheckAlt/> <br/> Cartão de Debito </li>
          <li onClick={aba3} className={"opcoes "+ classAba(2)}> <FaBarcode/> <br/> Boleto Bancário</li>
        </ul>

      <div className="forms">

        <section id="tab1" className={"credito " + classAba(0)}>
          <form className="form-cc" onSubmit={onPayCC}>
           <div className="ncartao">
            <label htmlFor="numerocartao">Numero do Cartão:</label>
            <input type="text" id="numerocartao" onChange={handleNumeroCartao} placeholder="0000 0000 0000 0000 000" required/>
           </div>
            <div className="nomecartao">
              <label htmlFor="nomecartao">Nome:</label>
              <input type="text" id="nomedocartao" onChange={handleNomeCartao} placeholder="Como está escrito no cartão" required/>
            </div>
            <div className="juntos">
              <div className="validade">
                <label htmlFor="validade">Validade:</label>
                <input type="text" onChange={handleValidade} placeholder="MM/AA" id="validade" required/>
              </div>

              <div className="cod">
                <label htmlFor="codigo">Codigo de Segurança:</label>
                <input type="number" id="codigo" onChange={handleCodigo} placeholder="CVV" required maxLength={3} />
              </div>
            </div>
            <input type="submit" className="btnsubmit" value="Finalizar Pagamento"/>
          </form>
        </section>

        <section id="tab2" className={"debito "+ classAba(1)}>
          <form className="form-db" onSubmit={onPayDB}>
            <div className="ncartao">
              <label htmlFor="numerocartao">Numero do Cartão:</label>
              <input type="text" id="numerocartao" placeholder="0000 0000 0000 0000 000" required/>
            </div>

              
              <div className="nomecartao">
                <label htmlFor="nomecartao">Nome:</label>
                <input type="text" id="nomedocartao" placeholder="Como está escrito no cartão" required/>
              </div>
              <div className="juntos">
                <div className="validade">
                  <label htmlFor="validade">Validade:</label>
                  <input type="text" placeholder="MM/AA" id="validade" required/>
                </div>

                <div className="cod">
                  <label htmlFor="codigo">Codigo de Segurança:</label>
                  <input type="number" id="codigo" placeholder="CVV"  required maxLength={3}/>
                </div>
              </div>
              <input type="submit" className="btnsubmit" value="Finalizar Pagamento"/>
            </form>
        </section>

        <section id="tab3" className={"boleto "+ classAba(2)}>
          <form onSubmit={onPayBB} className="form-bb">
            <ul className="dicas">
              <li><p>1</p> <FaPrint/> Faça o pagamento do boleto em uma agência bancária ou pela internet.</li>
              <li><p>2</p> <FaCalendarAlt/> Fique atento à data de vencimento do boleto.</li>
              <li><p>3</p> <FaMoneyBillAlt/> Lembre-se que o pagamento em boleto é somente à vista.</li>
            </ul>
            <div className="juntos">
              <div className="cep">
                <label htmlFor="cep">Cep</label>
                <input type="text" onChange={handleCep} placeholder="00000-000" id='cep' maxLength={8} minLength={8} required/>
              </div>
              <div className="numerocasa">
                <label htmlFor="numerocasa">Numero da Casa</label>
                <input type="number" placeholder="ex: 1000" onChange={handleNumeroCasa}  id="numerocasa" required maxLength={6}/>
              </div>
            </div>
            <div className="juntos">
              <div className="cep">
                <label htmlFor="documentype">Tipo de Documento</label>
                <select onChange={handleDocumentType} required id="documentype">
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>
              <div className="numerocasa">
                <label htmlFor="documentnumber"> {documentType} </label>
                <input type="number" onChange={handleDocumentNumber} id="documentnumber" minLength={11} maxLength={14} required/>
              </div>
            </div>
            <input type="submit" className="btnsubmit" value="Gerar Boleto"/>
          </form>
        </section>

      </div>
        </div>
        <Footer/>
    </div>
  );
}
export default Comprar;