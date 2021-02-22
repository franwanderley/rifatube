import React, { ChangeEvent, FormEvent, useState } from 'react';
import api from './../services/api';
import { Link,useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Footer from '../components/footer';
import Header from '../components/header';
import logo from './../images/logo.png';
import './../styles/login.css';
import Cripto from '../services/CryptoConfig';

interface User{
        id : number;
        nome : string;
        influenciador : boolean;
}


function Login(){

    function guardarUsuario(x : User){
        sessionStorage.setItem('rifatube/id', String(x?.id));
        sessionStorage.setItem('rifatube/nome', String(x?.nome));
        sessionStorage.setItem('rifatube/influencer', String(x?.influenciador));
        history.push("/");
    }
    function limparSessao(){
        if(sessionStorage.getItem('rifatube/id')){
            sessionStorage.clear();
        }
    }   
    async function onLogin(event : FormEvent){
        event.preventDefault();//Para não atualizar a pagina ao enviar
        try {
            const senhacripto = Cripto.criptografar(senha);
            const result = await api.get(`/users?email=${email}&senha=${senhacripto}`).then(res => {
            //   setUsuario(res.data);
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
        const aux = String(event.target.value);
        setEmail(aux);
    }
    function handlesenha(event : ChangeEvent<HTMLInputElement>){
        const aux = String(event.target.value);
        setSenha(aux);
    }

    const history = useHistory();
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    // const [usuario, setUsuario] = useState<User>();

    return (
        <div className="container">
            {limparSessao()}
            <Header/>
            
            <div className="login">
            <form onSubmit={onLogin} className="form-login">
                <img src={logo} alt="RifaTube"/>
                
                <div className="divemail">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={handleemail} placeholder="Seu E-mail" required/>
                </div>
                <div className="divsenha">
                    <label htmlFor="senha">Senha</label>
                    <input type="password" id="senha" onChange={handlesenha} placeholder="Sua Senha" required/>
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