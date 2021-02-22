import React, { ChangeEvent, FormEvent, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Header from './../components/header';
import Footer from './../components/footer';
import swal from 'sweetalert';
import api from '../services/api';
import {FaSave} from 'react-icons/fa';
import './../styles/novasenha.css';

interface Props{
    match : {
        params : {
            id : string;
        }
    }
}

function NovaSenha(props : Props){

    function handleSenha(event : ChangeEvent<HTMLInputElement>){
        const aux = event.target.value;
        setSenha(aux);
    }
    function handleSenha2(event : ChangeEvent<HTMLInputElement>){
        const aux = event.target.value;
        setSenha2(aux);
    }
    async function onNewSenha(event : FormEvent){
        event.preventDefault();
        try {
            if(senha === senha2){
                const data = { senha : senha };
                await api.put('mudarsenha/'+ props.match.params.id,data).then(res => {
                    if(res.data){
                        swal({title :"Senha Atualizado com Sucesso",icon: "success"});
                        history.push('/login');
                    }
                });
            }else
                swal({title: "Senhas não coincidem", text: "Tente Novamente!", icon: "warning"});

        } catch (error) {
            swal({title: "Erro no Formulario", text: String(error), icon: "warning"});
        }
    }

    const history = useHistory();
    const [senha,setSenha] = useState<string>("");
    const [senha2,setSenha2] = useState<string>("");

    return (
        <div className="container">
            <Header/>
            <div className="novasenha">
                <form onSubmit={onNewSenha} className="form-novasenha">
                    <h3>Redefinir Senha</h3>
                    <div className="divsenha">
                        <label htmlFor="senha1">Nova Senha</label>
                        <input type="password" size={25} onChange={handleSenha} placeholder="Digite Aqui Sua Nova Senha" id="senha1" required/>
                    </div>
                    <div className="divsenha">
                        <label htmlFor="senha2">Confirme sua Senha</label>
                        <input type="password" size={25} onChange={handleSenha2} placeholder="Confirme Aqui Sua Nova Senha" id="senha2" required/>
                    </div>
                    <button type="submit" className="btn-salve"><FaSave color="#f5f5f5"/> Salvar </button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}
export default NovaSenha;