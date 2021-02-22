import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import api from './../services/api';
import { Link,useHistory } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import logo from './../images/logo.png';
import Cripto from './../services/CryptoConfig';
import './../styles/registrar.css';
import swal from 'sweetalert';

interface Props{
    location : {
        state : string;
    };
}

function Registrar(props : Props){
    //Funções
    function handleemail(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setEmail(aux);

    }
    function handlesenha(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setSenha(aux);
    }
    function handlenome(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setNome(aux);
    }
    function handlesobrenome(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setSobrenome(aux);
    }  
    function handleendereco(event: ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setEndereco(aux);
    }
    function handleddd(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setDDD(aux);
    }
    function handlecelular(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setFone(aux);
    }
    function handleinfluenciador(event : ChangeEvent<HTMLInputElement>){
        const aux = Boolean(event.target.value);
        setInfluenciador(aux);
    }

    async function onRegistre(event : FormEvent){
        event.preventDefault();//Para não atualizar a pagina ao enviar
        // submit com JSON(Não permite arquivos)
        const telefone = DDD + " " + fone;
        const senhaCripto = Cripto.criptografar(senha);
        console.log(senhaCripto);
        setSenha(senhaCripto);
        const data = {
            email : email, senha : senhaCripto, nome : nome, sobrenome : sobrenome, endereco : endereco, telefone : telefone, influenciador : influenciador
        }; 

        //submit
        try{
            let id;
            if(props.location.state)
                id = await api.put('users/'+ props.location.state,data);
            else
                id = await api.post('users',data);//Vai conectar com o BACK_END e enviar informações do form 
            //Tem que ir para pagina deu certo
            swal({title: "Usuario Atualizado com Sucesso", icon: "success"});
            //Salvar na Sessão
            sessionStorage.setItem("rifatube/id", String(id.data));
            sessionStorage.setItem('rifatube/nome', String(nome));
            sessionStorage.setItem('rifatube/influencer', String(influenciador));
             history.push('/');//vai redimensionar para outra rota
        }catch(error){
            swal({title : "Erro no Formulario", text : String(error), icon : "warning"});
        }
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
    
    useEffect(()=>{
       function getUsers(){
            const id = props.location.state;
            console.log(id);
            if(id){
                api.get('users/'+ id).then(res => {
                const {id, email, senha, nome, endereco, sobrenome, telefone, influenciador} = res.data;
                const aux : string[] = telefone.split(' ');
                console.log(id);
                setEmail(email);
                const senhadescript = Cripto.descriptografar(senha);
                setSenha(senhadescript);
                console.log(senhadescript);
                setNome(nome);
                setEndereco(endereco);
                setSobrenome(sobrenome);
                setDDD(aux[0]);
                setFone(aux[1]);
                setInfluenciador(influenciador);
                });
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
                            <input type="email" value={email ? email : ""} onChange={handleemail} id="email" required/>
                        </div>
                        <div className="divsenha">
                            <label htmlFor="senha">Senha</label>
                            <input type="password" value={senha ? senha : ""} onChange={handlesenha} id="senha" required/>
                        </div>
                        <div className="divnome">
                            <label htmlFor="nome">Nome</label>
                            <input type="text" value={nome ? nome : ""} id="nome" onChange={handlenome} required/>
                        </div>
                        <div className="divsobrenome">
                            <label htmlFor="sobrenome">Sobrenome</label>
                            <input type="text" value={sobrenome ? sobrenome : ""} id="sobrenome" onChange={handlesobrenome} required/>
                        </div>
                    </div>

                    <div className="two">
                        <h3>Preencha mais<br/> alguns dados...</h3>
                        <div className="divendereco">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" value={endereco ? endereco : ""} id="endereco" onChange={handleendereco} required/>
                        </div>
                        <div className="divcelular">
                            <input type="text"  className="ddd" value={DDD ? DDD : ""} onChange={handleddd} placeholder="DDD"/>
                            <input type="text" className="numero" value={fone ? fone : ""} onChange={handlecelular} required placeholder="CELULAR"/>
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