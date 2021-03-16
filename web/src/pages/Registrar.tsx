import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link,useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from './../services/api';
import Cripto from './../services/CryptoConfig';
import Header from '../components/header';
import Footer from '../components/footer';

import logo from './../images/logo.png';
import './../styles/registrar.css';

interface Props{
    location : {
        state : string;
    };
}

function Registrar(props : Props){
    //Funções
    function handleemail(event : ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }
    function handlesenha(event : ChangeEvent<HTMLInputElement>){
        setSenha(event.target.value);
    }
    function handlenome(event : ChangeEvent<HTMLInputElement>){
        setNome(event.target.value);
    }
    function handlesobrenome(event : ChangeEvent<HTMLInputElement>){
        setSobrenome(event.target.value);
    }  
    function handleendereco(event: ChangeEvent<HTMLInputElement>){
        setEndereco(event.target.value);
    }
    function handleddd(event : ChangeEvent<HTMLInputElement>){
        setDDD(event.target.value);
    }
    function handlecelular(event : ChangeEvent<HTMLInputElement>){
        setFone(event.target.value);
    }
    function handleinfluenciador(event : ChangeEvent<HTMLInputElement>){
        setInfluenciador(Boolean(event.target.value));
    }

    async function onRegistre(event : FormEvent){
        //Para não atualizar a pagina ao enviar
        event.preventDefault();

        const telefone = DDD + " " + fone;
        const senhaCripto = Cripto.criptografar(senha);
        const data = {
            email         : email,
            senha         : senhaCripto,
            nome          : nome,
            sobrenome     : sobrenome,
            endereco      : endereco,
            telefone      : telefone,
            influenciador : influenciador
        }; 

        //submit
        if(props.location.state)
            await api.put(`users/${props.location.state}`, data)
            .then(res => swal({title: "Usuario salvo com Sucesso", icon: "success"}).then(() => history.push('/login', {email, senha})))
            .catch(error => swal({title: "Não foi possivel salvar o usuario!", icon: "warning"}));
        else
            await api.post('users',data)                
            .then(res => swal({title: "Usuario atualizado com Sucesso", icon: "success"}).then(() => history.push('/login', {email,senha})))
            .catch(error => swal({title: "Não foi possivel salvar o usuario!", icon: "warning"}));
    }
    const history = useHistory();//Para redimensionar o usuario
    //State
     const [email,setEmail]                  = useState<string>("");
     const [senha,setSenha]                  = useState<string>("");
     const [nome,setNome]                    = useState<string>("");
     const [endereco,setEndereco]            = useState<string>("");
     const [sobrenome,setSobrenome]          = useState<string>("");
     const [DDD, setDDD]                     = useState<string>("");
     const [fone, setFone]                   = useState<string>("");
     const [influenciador, setInfluenciador] = useState<boolean>(false);
    
     //Pegar dados do usuario cajo seja para editar
    useEffect(()=>{
       async function getUsers(){
            const id = props.location.state;
            if(id){
                const { email, senha, nome, endereco, sobrenome, telefone, influenciador} = await api.get(`users/${id}`)
                .then(res => res.data);

                const aux : string[] = telefone.split(' ');
                setEmail(email);
                let senhadescript;
                try{
                    senhadescript = Cripto.descriptografar(senha);
                }catch(error){}
                setSenha(senhadescript || "");
                setNome(nome);
                setEndereco(endereco);
                setSobrenome(sobrenome);
                setDDD(aux[0]);
                setFone(aux[1]);
                setInfluenciador(influenciador);
            } 
       }
       getUsers();
    },[props]);

    return (
        <div className="container">
            <Header/>
            <div className="registrar">
                <form onSubmit={onRegistre} className="form-registrar">
                    <div className="one">
                        <img src={logo} alt="RifaTube"/>
                        
                        <div className="divemail">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={email || ""} onChange={handleemail} id="email" required/>
                        </div>
                        <div className="divsenha">
                            <label htmlFor="senha">Senha</label>
                            <input type="password" value={senha || ""} onChange={handlesenha} id="senha" required/>
                        </div>
                        <div className="divnome">
                            <label htmlFor="nome">Nome</label>
                            <input type="text" value={nome || ""} id="nome" onChange={handlenome} required/>
                        </div>
                        <div className="divsobrenome">
                            <label htmlFor="sobrenome">Sobrenome</label>
                            <input type="text" value={sobrenome || ""} id="sobrenome" onChange={handlesobrenome} required/>
                        </div>
                    </div>

                    <div className="two">
                        <h3>Preencha mais<br/> alguns dados...</h3>
                        <div className="divendereco">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" value={endereco || ""} id="endereco" onChange={handleendereco} required/>
                        </div>
                        <div className="divcelular">
                            <input type="text"  className="ddd" value={DDD || ""} onChange={handleddd} placeholder="DDD"/>
                            <input type="text" className="numero" value={fone || ""} onChange={handlecelular} required placeholder="CELULAR"/>
                        </div>
                        <div className="divinfluencer">
                            <label htmlFor="influencer">Influenciador</label>
                            <input type="checkbox" name="CHECK" id="influencer" onChange={handleinfluenciador}/>
                        </div>
                        <div className="btn">
                            <button type="submit" className="btn-entrar">Registrar</button>
                            <Link to="/login"  className="btn-registrar">Entrar</Link>
                        </div>
                    </div>
                </form>
            </div>
            <Footer/>
        </div>
    );
}
export default Registrar;