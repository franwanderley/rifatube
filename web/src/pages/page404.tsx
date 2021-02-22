import React from 'react';
import Header from './../components/header';
import Footer from './../components/footer';
import {Link} from 'react-router-dom';
import './../styles/page404.css';
function page404 (){
    return (
        <div className="container">
            <Header/>
            <div className="notfound">
                <h1>404</h1>
                <h2>Pagina Não Encontrado!</h2>
                <Link to="/">Voltar Para Home!</Link>
            </div>
            <Footer/>
        </div>
    );
}
export default page404;