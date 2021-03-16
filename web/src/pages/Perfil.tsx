import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import swal from 'sweetalert';

import api from './../services/api';
import Dropzone from './../components/upload';
import Cripto from './../services/CryptoConfig';
import Header from './../components/header';
import Footer from './../components/footer';

import './../styles/perfil.css';

interface Rifa{
    id         : number;
    idusuario  : number;
    idcampanha : number;
    situacao   : string;
    data       : string;
    numero     : number;
    produto    : string;
}
interface Usuario{
    id            : number;
    nome          : string;
    email         : string;
    senha         : string;
    sobrenome     : string 
    endereco      : string
    telefone      : string;
    foto          : string;
    descricao     : string;
    influenciador : boolean;
}
interface Campanha {
    id          : number;
    produto     : string;
    imagem      : string;
    datasorteio : string;
    qtdmax      : number;
    qtd         : number;
    situacao    : string;
    preco       : number;
    idcriador   : number;
}
interface Props {
    match : {
        params : {
            id : string;
        }
    }
}
function Perfil(props : Props){
    
    function redirecionar(){
        history.push('/login');
    }

    async function updateUsuario(event : FormEvent){
        event.preventDefault();//Não atualiza a pagina
        //Submit por multipath/form-data para que possa ter upload das imagens
        const data = new FormData();
        data.append('descricao', descricao);
        selectedFile && data.append('foto', selectedFile);
        try{
            //Editar descrição, imagem
            await api.put('users1/'+ usuario?.id,data); 
            //Tem que ir para pagina deu certo
            swal({title : "Foto e Descrição atualizado com successo!", icon : "success"});
        }catch(error){
            swal({title : "Foto e Descrição não atualizado!",text : String(error), icon : "warning"});
        }
    }
    function handleDescricao(event : ChangeEvent<HTMLTextAreaElement>){
        setDescriçao(event.target.value);
    }
    //Funções para mudar de abas
    function aba1(){
        setAbas(1);
    }
    function aba2(){
        setAbas(0);
    }

    const history = useHistory();
    const [usuario,setUsuario] = useState<Usuario>();
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [descricao,setDescriçao] = useState<string>("");
    const [rifas, setRifas] = useState<Rifa[]>([]);
    const [abas, setAbas] = useState<Number>(1);
    const [pageRifa, setPageRifa] = useState<number>(1);
    const [pageCampanha, setPageCampanha] = useState<number>(1);

    //Pegar um Usuario
    useEffect(()=>{
        async function user(){
            let id;
            try{
                id =  Cripto.descriptografar( String( props.match.params.id ));
            }catch(error){
                swal({title: "Usuario não encotrado!", icon:"warning"}).then(res => redirecionar());
            }
            if( id ){
                await api.get('users/'+ id)
                .then(res => setUsuario(res.data))
                .catch(error => swal({title: "Usuario não encotrado!", icon: "warning"}));
            }
        }
        const session = sessionStorage.getItem('rifatube/id');
        if(session)
            user();
        else
            redirecionar();
    },[props]);
    //Pegar imagem do back end
    useEffect(() => {
        async function pegarImagem(){
            if(usuario){
                await api.get(`uploads/${usuario?.foto}`)
                .then(res => setSelectedFile(res.data))
                .catch(error => setSelectedFile(undefined));
            }
        }
        setDescriçao(usuario?.descricao || "");
        pegarImagem();
    }, [usuario]);

    // Pegar campanha por idCriador
    useEffect(() => {
        async function getCampanhas(){
            await api.get('campanha?idc='+ usuario?.id + '&page='+ pageCampanha )
            .then(res => setCampanhas(res.data))
            .catch(error => setCampanhas([]));
        }
        getCampanhas();
    }, [usuario, pageCampanha]);

    //Procurar Rifa por idusuario
    useEffect(() => {
        api.get('rifa?idu=' + usuario?.id + '&page='+ pageRifa)
        .then(res => setRifas(res.data))
        .catch(error => setRifas([]));
    }, [usuario, pageRifa]);

    return (
            <div className="container">
                <Header/>
                <div className="perfil">
                    <div className="aside">
                        <form onSubmit={updateUsuario}>
                            <h3>Adicionar Foto do Perfil</h3>
                            <Dropzone onFileUploaded={setSelectedFile} />
                            { usuario?.foto && 
                                <img src={`${process.env.REACT_APP_HOST}uploads/${usuario?.foto}`} className="imgperfil" alt="Foto do Usuario"/> 
                            }
                            <h3>Adicionar Descrição</h3>
                            <textarea id="text" value={descricao} onChange={handleDescricao} spellCheck={true} cols={30} rows={10} placeholder="Descreva seu perfil e adicione links para sua rede social"></textarea>
                            <div className="formbtn"> 
                            <button type="submit" className="btn-salva">Salvar</button>
                            <Link to={{pathname : "/registrar", state : usuario?.id}} className="btn-editar">Editar</Link>
                            </div>
                        </form>
                    </div>
                    <div className="section">
                        <div className="btn-campanha">
                                <h4 onClick={aba1} className={'btnone ' + ( abas && 'marcado' )}>Minhas Campanhas</h4>
                                <h4 onClick={aba2} className={'btntwo ' + ( !abas && '' )}> Minhas Rifas</h4>
                                <Link to="/criarcampanha" className="btn-add">Adicionar Campanha</Link>
                                <Link to="/" className="btn-ver">Ver Campanha</Link>
                        </div>
                        <div id="minhascampanhas" className={"minhascampanhas " + ( !abas && "desativado" )}>
                            <table>
                                <tr>
                                    <th>Imagem</th>
                                    <th>Produto</th>
                                    <th>Data do Sorteio</th>
                                    <th>Qtd maxima</th>
                                    <th>Quantidade</th>
                                    <th>Situação</th>
                                    <th>Preço</th>
                                    <th>Opções</th>
                                </tr>

                                {campanhas.map(campanha => (
                                    <tr key={campanha.id}>
                                        <td key={campanha.id + "i"}><img src={campanha.imagem} alt={campanha.produto}/></td>
                                        <td key={campanha.id + "p"}>{campanha.produto}</td>
                                        <td key={campanha.id + "d"}>{campanha.datasorteio}</td>
                                        <td key={campanha.id + "qm"}>{campanha.qtdmax}</td>
                                        <td key={campanha.id + "q"}>{campanha.qtd}</td>
                                        <td key={campanha.id + "s"}>{campanha.situacao}</td>
                                        <td key={campanha.id + "pr"}><strong>R$ {campanha.preco}</strong></td>
                                        <td key={campanha.id + "L"}><Link to={"/campanha/"+ campanha.id}>Ver Campanha</Link></td>
                                    </tr>
                                ))}
                            </table>
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
                        <div id = "minhasrifas" className={"minhasrifas " + (abas && "desativado")}>
                        <table>
                                <tr>
                                    <th>Campanha</th>
                                    <th>Situação</th>
                                    <th>Data</th>
                                    <th>Numero</th>
                                    <th>Opções</th>
                                </tr>

                                {rifas.map(rifa => (
                                    <tr key={rifa.id}>
                                        <td key={rifa.id + "i"}>{rifa.produto}</td>
                                        <td key={rifa.id + "s"}>{rifa.situacao}</td>
                                        <td key={rifa.id + "d"}>{rifa.data}</td>
                                        <td key={rifa.id + "n"}>{rifa.numero}</td>
                                        <td key={rifa.id + "L"}><Link to={"/campanha/"+ rifa.idcampanha}>Ver Campanha</Link></td>

                                    </tr>
                                ))}
                            </table>
                            <div className="pagination">
                                <button  onClick={() => setPageRifa(pageRifa -1)} disabled={pageCampanha === 1}>{'<'}</button>
                                <button  className={pageRifa === 1 ? "marca" : ""} onClick={() => setPageRifa(1)}>1</button>
                                <button  className={pageRifa === 2 ? "marca" : ""} onClick={() => setPageRifa(2)}>2</button>
                                <button  className={pageRifa === 3 ? "marca" : ""} onClick={() => setPageRifa(3)}>3</button>
                                <button  className={pageRifa === 4 ? "marca" : ""} onClick={() => setPageRifa(4)}>4</button>
                                <button  className={pageRifa === 5 ? "marca" : ""} onClick={() => setPageRifa(5)}>5</button>
                                <button  onClick={() => setPageRifa(pageRifa +1)} disabled={pageCampanha === 5}>{'>'}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
}
export default Perfil;