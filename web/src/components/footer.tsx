import React from 'react';
import logo2 from './../images/logo-2.png';
import {FaInstagram, FaFacebook, FaYoutube} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './../styles/footer.css';

function Footer(){
    return (
        <footer>
            <div className="menu">
                <Link to="/sobre">Sobre</Link>
                <Link to="/termosdeuso">Termos de Uso</Link>
                <Link className="last" to="/">Campanhas</Link>
            </div>
            <div className="copy">
                <Link to="/">
                    <img src={logo2} alt="RifaTube"/>
                </Link>
                <p className="pcopy">&copy; Todos os direitos Reservados</p>
            </div>
            <div className="social">
                <a href="htttps://www.instagram.com"> <FaInstagram/> </a>
                <a href="htttps://www.facebook.com"> <FaFacebook/> </a>
                <a href="htttps://www.youtube.com"> <FaYoutube/> </a>
        </div>


        </footer>
    )
}
export default Footer;