import React, { ChangeEvent, FormEvent, useState } from 'react';
import {Link, useHistory } from 'react-router-dom';
import {FaBars,FaSearch, FaTimesCircle} from 'react-icons/fa';

import Cripto from './../services/CryptoConfig';

import Logo from './../images/logo.png';
import './../styles/header.css';
import { preProcessFile } from 'typescript';


function Header(){
    const [search, setSearch] = useState<string>("");
    const [menuActive,setMenuActive] = useState(0);
    const history = useHistory();

    //Assim que o input muda Cai nessa função
    function openMenu(){
        (menuActive === 0) ?
            setMenuActive(1)
        :
            setMenuActive(0);
    }

    function perfil(){
        const id = sessionStorage.getItem('rifatube/id');
        return (id) ?
            <div className={"perfil "}>
                <Link to={'/perfil/' + Cripto.criptografar(id)}>{sessionStorage.getItem('rifatube/nome')}</Link>
                <Link to='/login'>Sair</Link>
            </div>
        : 
            <div className={"perfil "}>
            <Link to='/login'>Entrar</Link>
            <Link to='/registrar'>Registrar</Link>
        </div>;
    }
    function perfilResp(){
        //Perfil Responsivo
        const id = sessionStorage.getItem('rifatube/id');
        return (id) ?
            <div className={"perfil2 " + (menuActive && "open")}>
                <Link to={'/perfil/'+ Cripto.criptografar(id)}>{sessionStorage.getItem('rifatube/nome')}</Link>
                <Link to='/login'>Sair</Link>
            </div>
        : 
            <div className={"perfil2 " + (menuActive && "open")}>
            <Link to='/login'>Entrar</Link>
            <Link to='/registrar'>Registrar</Link>
        </div>;
        
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        setSearch(event.target.value);
    }
    //função para pesquisar
    function onSearch(event : FormEvent){
        event.preventDefault();
        history.push("/",search);
    }

    return (
           <header>
                <div className="image">
                    <Link to="/">
                        <img src={Logo} alt="Logo do RifaTube" className="img"/>
                    </Link>
                </div>
                <button className="btnmenu" onClick={openMenu}>
                    {
                        menuActive ? <FaTimesCircle/> : <FaBars/>
                    }
                </button>    
                <form className="form-search" onSubmit={onSearch}>
                 <input type="search" placeholder="Pesquisar Campanhas"  className="input-search" onChange={handleInputChange}/>
                 <button type="submit"> <FaSearch/> </button>
                </form>
                {perfil()}

                <nav className={"menu " + (menuActive && "open")}>
                    <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="sobre">Sobre</Link></li>
                    <li><Link to="termos">Termos de Uso</Link></li>
                    </ul>
                    <form className={"form-search " + (menuActive && "open")} onSubmit={onSearch}>
                        <input type="search" placeholder="Pesquisar Campanhas"  className="input-search" onChange={handleInputChange}/>
                        <button type="submit"> <FaSearch/> </button>
                    </form>
                    {perfilResp()}
                </nav>
            
            </header>
    );
}
export default Header;