import React from 'react';
import { FaDatabase, FaNodeJs, FaPaypal, FaReact, FaUpload } from 'react-icons/fa';

import Header from './../components/header';
import Footer from './../components/footer';

import './../styles/sobre.css';

function Sobre(){
    return (
        <div className="container">
            <Header/>
            <div className="sobre">
                <h2>Sobre</h2>
                <p>Este é um site serve apenas para testar minhas habilidades em desenvolvimento web. Feito por <a href="https://www.github.com/franwanderley"><strong>Francisco Wanderley</strong></a>, é um site de sorteio onde você pode escolher entre varios produtos para testar a sorte.</p>
                <h3>Tecnologias Usadas</h3>
                <ul>
                    <li><FaDatabase/> NoSQL</li>
                    <li><FaNodeJs/> NodeJS</li>
                    <li><FaReact/> ReactJS</li>
                    <li><FaPaypal/> Pagamento via Getnet</li>
                    <li><FaUpload/> Deploy via Heroku</li>
                </ul>
            </div>
            <Footer/>
        </div>
    );
}
export default Sobre;
