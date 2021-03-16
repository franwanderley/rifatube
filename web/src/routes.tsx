import React  from 'react';
import { BrowserRouter, Route,Switch } from 'react-router-dom';
import Home from './pages/Home'; //Pagina Home (Não precisa colocar extensão)
import Login from './pages/Login'; //Pagina orfanatos no mapa (Não precisa colocar extensão)
import Registrar from './pages/Registrar';
import CreateCampanha from './pages/CreateCampanha';
import Campanha from './pages/Campanha';
import Perfil from './pages/Perfil';
import Comprar from './pages/Comprar';
import  MandarEmail from './pages/mandaremail';
import  NovaSenha from './pages/NovaSenha';
import Sobre from './pages/Sobre';
import TermosdeUso from './pages/TermosdeUso';
import page404 from './pages/page404';



// const PrivateRoute  = ({component : Component, ...rest} ) => (
//       <Route {...rest} render={
//         props => isAuthentic() ? (
//             <Component {...props}/>
//         ) : (
//             <Redirect to={{pathname: "/", state: { from: props.location }}} />
//         )
//     } />
// );

function Routes(){
    return (
        <BrowserRouter>
           <Switch>
                <Route path="/" component={Home} exact={true}/>
                <Route path="/login" component={Login} exact={true} />
                <Route path="/registrar" component={Registrar} exact={true} />
                <Route path="/campanha/:id" component={Campanha} exact={true} />
                <Route path="/criarcampanha" component={CreateCampanha} exact={true} />
                <Route path="/perfil/:id" component={Perfil} exact={true} />
                <Route path="/comprar" component={Comprar} exact={true} />
                <Route path="/mandaremail" component={MandarEmail} exact={true} />
                <Route path="/novasenha/:id" component={NovaSenha} exact={true} />
                <Route path="/sobre" component={Sobre} exact={true}/>
                <Route path="/termosdeuso" component={TermosdeUso} exact={true}/>
                <Route path="*" component={page404} exact={true}/>
           </Switch>
        </BrowserRouter>
    );
}
export default Routes; //Toda vez precisa exportar esse componente