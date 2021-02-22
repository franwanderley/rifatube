import React, { ChangeEvent, FormEvent, useState } from 'react';
import Header from './../components/header';
import Footer from './../components/footer';
import api from '../services/api';
import swal from 'sweetalert';
import {FaPaperPlane} from 'react-icons/fa';
import './../styles/mandaremail.css';

function MandarEmail(){


    function handleEmail(event : ChangeEvent<HTMLInputElement>){
        const aux = event.target.value;
        setEmail(aux);
    }
    async function onSend(event : FormEvent){
        event.preventDefault();
        if(email){
           try {
                const result = await api.get('email?email='+ email).then(res => {
                    return res.data;
                });
                if(result)
                    swal({title : "Email enviado com successo", text : "Acesse o seu e-mail para redefinir sua senha!",  icon : "success"});
                else
                
                console.log(result);
            } catch (error) {
                swal({title : "Email não enviado", text : String(error), icon : "warning"});
           }
        }
    }

    const [email, setEmail] = useState<string>("");

    return (
        <div className="container">
            <Header/>
            <div className="mandaremail">
                <form onSubmit={onSend} className="form-mandaremail">
                <h3>Recuperação de Senha</h3>
                <p>Digite abaixo o e-mail cadastrado em sua conta.</p>
                    <div className="divemail">
                        <label htmlFor="email">Digite seu Email</label>
                        <input type="email" size={25} onChange={handleEmail} placeholder="SEU E-MAIL" id="email" required/>
                    </div>
                    <button type="submit" className="btn-send"><FaPaperPlane color="#f5f5f5"/>Enviar</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}
export default MandarEmail; 