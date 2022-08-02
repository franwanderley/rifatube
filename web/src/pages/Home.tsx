import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import api from './../services/api';
import cripto from './../services/CryptoConfig';
import Header from './../components/header';
import Footer from './../components/footer';
import './../styles/home.css';

interface Campanha {
    id          : number;
    produto     : string;
    imagem      : string;
    dataSorteio : string;
    qtdmax      : number;
    qtd         : number;
    situacao    : string;
    preco       : number;
    idGanhador  : number;
    idCriador   : number;
}
interface Props{
    location : {
        state : string;
    };
}

function Home(props : Props){

    const [campanhas,setCampanhas] = useState<Campanha[]>([]);
    const [pageCampanha, setPageCampanha] = useState<number>(1);

    useEffect( () => {
        async function pesquisa()  {
            const search = props.location.state;
             if(search){
                await api.get(`campanha?search=${search}&page=${pageCampanha}`)
                .then(res => setCampanhas(res.data))
                .catch(error => setCampanhas([]) );
            }else{
                await api.get(`campanha?page=${pageCampanha}`)
                .then( res => setCampanhas(res.data))
                .catch(error => setCampanhas([]));
            }
        }

        pesquisa();
     },[props, pageCampanha]);


     return (
        <div className="content">
            <Header />
            <div className="home">
                <div className="mostracampanha">
                {!campanhas?.length ? 
                    <div className="emptyState"> Campanhas não encotrada! </div>
                : (
                    campanhas.map((campanha : Campanha) => (
                       <div key={campanha?.id} className="campanhas">
                           <h3>{campanha?.produto}</h3>
                           <img src={campanha?.imagem} alt={campanha?.produto}/>
                           <progress max={campanha?.qtdmax} value={campanha?.qtd}></progress>
                           <div className="link">
                             <Link className={"participar " + (campanha?.situacao === "Finalizado" ? "fim" : "")}  to={"campanha/"+ cripto.criptografar(String(campanha.id))}>{campanha.situacao === "Finalizado" ? "Finalizado" : "Participar"}</Link>
                             <Link className={"preco " + (campanha?.situacao === "Finalizado" ? "fim" : "")} to={"campanha/"+ cripto.criptografar(String(campanha.id))}>{"R$ "+ campanha.preco}</Link>
                            </div> 
                       </div>
                    ))
                )}
                </div>
                <div className="pagination">
                    <button  onClick={() => setPageCampanha(pageCampanha -1)} disabled={pageCampanha === 1} >{'<'}</button>
                    <button  className={pageCampanha === 1 ? "marca" : ""} onClick={() => setPageCampanha(1)}>1</button>
                    <button  className={pageCampanha === 2 ? "marca" : ""} onClick={() => setPageCampanha(2)}>2</button>
                    <button  className={pageCampanha === 3 ? "marca" : ""} onClick={() => setPageCampanha(3)}>3</button>
                    <button  className={pageCampanha === 4 ? "marca" : ""} onClick={() => setPageCampanha(4)}>4</button>
                    <button  className={pageCampanha === 5 ? "marca" : ""} onClick={() => setPageCampanha(5)}>5</button>
                    <button  onClick={() => setPageCampanha(pageCampanha +1)} disabled={pageCampanha === 5}>{'>'}</button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Home;