import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Link,useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from './../services/api';
import Cripto from '../services/CryptoConfig';
import Header from '../components/header';
import Footer from '../components/footer';

import logo from './../images/logo.png';
import './../styles/login.css';

interface User{
        id : number;
        nome : string;
        influenciador : boolean;
}

interface LoginProps{
   location :{
       state:{
            email? : string;
            senha? : string;
       }
   }
}

function Login(props : LoginProps){

    function guardarUsuario(x : User){
        sessionStorage.setItem('rifatube/id', String(x?.id));
        sessionStorage.setItem('rifatube/nome', String(x?.nome));
        sessionStorage.setItem('rifatube/influencer', String(x?.influenciador));
        history.push("/");
    }
    async function onLogin(event : FormEvent){
        event.preventDefault();

        try {
            const senhacripto = Cripto.criptografar(senha);
            const result = await api.get(`/users?email=${email}&senha=${senhacripto}`).then(res => {
                return res.data;
            } );
            if(result){
            guardarUsuario(result);
            }
            else if(result === 0){
                swal({title : "Usuario não encotrado!", text: "Tente Novamente!", icon : "warning"});
        }
        } catch (error) {
            return ;
        }
    }
    function handleemail(event : ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }
    function handlesenha(event : ChangeEvent<HTMLInputElement>){
        setSenha(event.target.value);
    }

    const history = useHistory();
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    //limpar a sessão ao redirecionar para login
    useEffect(() => {
        if(sessionStorage.getItem('rifatube/id')){
            sessionStorage.clear();
        }
    },[]);

    //pegar os parametros da pagina registrar
    useEffect(() => {
        setEmail(props?.location?.state?.email || "");
        setSenha(props?.location?.state?.senha || "");
    }, [props]);


    return (
        <div className="container">
            <Header/>
            
            <div className="login">
                <form onSubmit={onLogin} className="form-login">
                    <img src={logo} alt="RifaTube"/>
                    
                    <div className="divemail">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} id="email" onChange={handleemail} placeholder="Seu E-mail" required/>
                    </div>

                    <div className="divsenha">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" onChange={handlesenha} value={senha} placeholder="Sua Senha" required/>
                    </div>

                    <div className="btn">
                        <button type="submit" className="btn-entrar">Entrar</button>
                        <Link to="/registrar"  className="btn-registrar">Registrar</Link>
                    </div>

                    <Link to="/mandaremail" className="esqsenha">Esqueceu a Senha?</Link>
                </form>
            </div>

            <Footer/>
        </div>
    );
}
export default Login;