import express from 'express';
import axios from 'axios';
import knex from './database/connection';
import multer from 'multer';
import multerConfig from './config/mullter';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import DateConfig from './config/DateConfig';

interface User{
    id : number;
    nome : string;
}
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
    idGanhador  : number;
    idCriador   : number;
}
interface Resp{
    data : { 
        access_token : string
    }
}


dotenv.config();
const routes = express.Router();
const upload = multer(multerConfig);
 
routes.post('/users', async (req, res) => {
    let {email,senha, nome, sobrenome, endereco, telefone, influenciador} = req.body;
    console.log([email,senha, nome, sobrenome, endereco, telefone, influenciador]);
    const trx = await knex.transaction();
    //Inserir não esqueça do await
    const id = await trx('usuario').insert({email, senha, nome, sobrenome, endereco, telefone, influenciador});
    await trx.commit();
    if(id) 
        return res.json(id);
    
    return res.status(500).json("Não foi possivel inserir o usuario!");
});

 routes.get('/users', async (req, res) => { 
     const email = req.query.email ? String(req.query.email) : null;
     let senha = req.query.senha ? String(req.query.senha) : null;

      if(email && senha){
          try{
            const resultado = await knex('usuario').where({email : email, senha : senha}).select("*").first();
          
            if(resultado){
                return res.json(resultado);
            }else 
                return res.status(500).json(0);
          }catch (error) {
              console.log(error);
          }
      }
      else{
         const result = await knex('usuario').select("*");
         if(result)
             return res.json(result);
  
         return res.json({message : "Não existe usuario"});
      }
 });

 routes.get('/users/:id', async (req,res) => {
     const id = Number(req.params.id);
     //Procurar no array pelo id
     const usuario = await knex<Usuario>('usuario').where({id : id}).first();
     if(usuario){
        return res.json(usuario);
     }else
        return res.status(500).json("Não encontrado!");
 });
 
 //Mudar Imagem e Descrição do usuario
 routes.put('/users1/:id',upload.single('foto'), async (req, res) => {
    const id = Number(req.params.id);
    const {descricao} = req.body;

    const trx = await knex.transaction();
    //Inserir não esqueça do await
    const idupdate = await trx('usuario').where('id', '=', id).update({foto : req.file.filename, descricao : descricao});
    await trx.commit();
    if(idupdate) 
        return res.json(idupdate);    
    return res.status(500).json({message: "Usuario não atualizado!"});
 });

 routes.put('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const {email, senha, nome, sobrenome, endereco, telefone, influenciador} = req.body;
    const trx = await knex.transaction();
    //Inserir não esqueça do await
    const result = await trx('usuario').where('id', '=', id).update({ email: email, senha : senha, nome : nome, sobrenome : sobrenome, endereco : endereco, telefone : telefone, influenciador : influenciador});
    await trx.commit();
    if(result) 
        return res.json(result);
    
    return res.status(500).json("Não foi possivel inserir o usuario!");
 });

routes.put('/mudarsenha/:id', async (req, res) =>{
    const id = Number(req.params.id);
    let {senha} = req.body;
    if(id && senha){
        const trx = await knex.transaction();
        const result = await trx('usuario').where('id', '=', id).update({senha : senha});
        await trx.commit();
        if(result)
            return res.json(result);
        else
            return res.status(500).json(result);
    }
});

 routes.post('/campanha', async (req, res) => {
    const {produto, imagem, datasorteio, qtdmax, qtd, situacao, preco, idCriador} = req.body;
    
   try {
        const trx = await knex.transaction();
        const idcampanha = await trx('campanha').insert({produto, imagem, datasorteio, qtdmax, preco, qtd, situacao, idCriador});
        await trx.commit();
        if(idcampanha){
            return res.json(idcampanha);
        }   
        else
          return res.status(500).json('Algo deu errado');
   } catch (error) {
       return res.status(500).json(error);
   }
 });

 routes.get('/campanha', async (req, res) => {
     const page   = req.query.page ? Number(req.query.page) : 1;
     const search = req.query.search ? String(req.query.search) : "";
     const idc    = req.query.idc ? Number(req.query.idc) : null;
     const idr    = req.query.idr ? Number(req.query.idr) : null;
     if(search !== "" && search){
         const offset = (page-1) * 5;
         const resultado = await knex<Campanha>('campanha').where('produto', "LIKE", `%${search}%`).limit(5).offset(offset);
         console.log("Resultado: "+ resultado);
         if(resultado)
             return res.json(resultado);
         else
             return res.status(500).json({
                 message : "Não foi encontrado!"
             });
    }
    else if(idc){       
        const limit = 5;
        const offset = (page-1) * limit;
        console.log("ok" + idc); 
        const resultado = await knex('campanha').select("*").where('idcriador', "=", idc).limit(limit).offset(offset);
        if(resultado)
            return res.json(resultado);
        else
            return res.status(500).json({
                message : "Não foi encontrado!"
            });
     }
     else if(idr){
         console.log('Rifa');
        const resultado = await knex<{produto : string}>('campanha').where('id', "=", idr).first();
        if(resultado?.produto)
            return res.json(resultado);
        else
            return res.status(500).json("Não foi encontrado!");
     }else{
         console.log("Home");
         const offset = (page-1) * 5;
         const result =  await knex('campanha').select("*").limit(5).offset(offset);
         return res.json(result);
     }
 });

 routes.get('/campanha/:id', async (req, res) => {
     //Parametro
     const id = Number(req.params.id);
     //Procurar no Array pelo id
    const campanha = await knex<Campanha>('campanha').where('id', '=', id).first();
    if(campanha){
        //Já passou do tempo
        const hojeS = DateConfig.getHoje();
        if(DateConfig.CompareDate(hojeS,campanha.datasorteio) && campanha.situacao !== "Finalizado"){
            //Fazer Sorteio
            const rifas = await knex<{numero : number; idusuario : number; idcampanha: number}>('rifa').where({idcampanha : campanha?.id});
            const numero = rifas.map(r => r.numero);
            const aleatorio = Math.round(Math.random() * ((numero.length-1) - 0) + 0);
            const numeroV = numero[aleatorio];
            const rifaGanhador = rifas.find( r => r.numero === numeroV);

            const trx = await knex.transaction();
            const result = await trx('campanha').where('id', '=', id).update({situacao : "Finalizado", idganhador : rifaGanhador?.idusuario});
            await trx.commit();
            if(result){
                campanha.situacao = "Finalizado";
                campanha.idGanhador = rifaGanhador?.idusuario || 0;
                return res.json(campanha);
            }
            else
                return res.status(500).json("Não foi possivel mudar a campanha para finalizado");
        }
        else
            return res.json(campanha);
    }
    else
        return res.status(500).json("NÃO EXISTE CAMPANHA COM ESTE ID");
 });

 routes.get('/example', async (req, res) => {
    const campanha = {id : 6};
    const rifas = await knex<{numero : number; idusuario : number; idcampanha: number}>('rifa').where({idcampanha : campanha?.id});
    const numero = rifas.map(r => r.numero);
    const aleatorio = Math.round(Math.random() * ((numero.length-1) - 0) + 0);
    const numeroV = numero[aleatorio];
    const rifaGanhador = rifas.find( r => r.numero === numeroV);
    const isSucceeded = await knex('campanha').update({idganhador : rifaGanhador?.idusuario})
    
    return res.json({
        usuarioId : rifaGanhador?.idusuario
    });
 })

routes.post("/rifa", async (req, res) => {
    const {idusuario, idcampanha, situacao, data, numero, payment_id, link_boleto} = req.body;
    console.log("Boleto " + [link_boleto, payment_id]);
    let idrifa;
    if(!payment_id){
    const trx = await knex.transaction();
    idrifa = await trx('rifa').insert( {idusuario, idcampanha, situacao, data, numero} );
    await trx.commit();
    }else{
        const trx = await knex.transaction();
        idrifa = await trx('rifa').insert( {idusuario, idcampanha, situacao, data, numero, link_boleto, payment_id} );
        await trx.commit();
    }
    if(idrifa){
        //Aumentar o contador
        try {
            const rs = await knex<{id : number}>('rifa').where('idcampanha', '=', '1');
            const cont = rs.length;
            const tst = await knex.transaction();
            const idr = await tst('campanha').update({qtd : cont}).where('id', '=', idcampanha);
            await tst.commit(); 

       }catch(error){
           console.log(error);
       }
        return res.json(idrifa);
    }else
        return res.status(500).json("Algo deu errado");
});

routes.get('/rifa', async (req, res) => {
     const idcampanha = req.query.idc  ? Number(req.query.idc)  : 0;
     const idusuario  = req.query.idu  ? Number(req.query.idu)  : 0;
     const page       = req.query.page ? Number(req.query.page) : 1;

     const limit = 5;
     const offset = (page -1) * limit; 

     let result : Rifa[];
     if(idcampanha !== 0){
         result =  await knex<Rifa>('rifa').select("*").where('idcampanha', '=', idcampanha);
         let rifas : Rifa[] = [];
         //Ver se o boleto venceu e deletar do banco de dados
         result.map(async rifa => {
            if(rifa?.situacao === "pendente"){
                const passou = DateConfig.venceuboleto(rifa?.data);
                if(passou !== 0){
                    await knex('rifa').delete().where({id : rifa?.id});
                    console.log("id da rifa "+ rifa.id);
                }
                else
                    rifas.push(rifa);
            }
            else
                rifas.push(rifa);
        });

        if(!rifas)
            return res.status(500).json("Não encotrado!");
        return res.json(rifas);
            
     }else if(idusuario !== 0){
         //Busca Rifa(junto com  campanha) por Usuario 
        result = await knex<Rifa[]>('rifa').where('idusuario', '=', idusuario).join('campanha', 'rifa.idcampanha', '=', 'campanha.id').select('rifa.*', 'campanha.produto').limit(limit).offset(offset);
        
        //Ver se o boleto venceu e deletar do banco de dados
        let rifas : Rifa[] = [];
        result.map(async rifa => {
           if(rifa?.situacao === "pendente"){
               const passou = DateConfig.venceuboleto(rifa?.data);
               if(passou !== 0){
                   await knex('rifa').delete().where({id : rifa?.id});
                   console.log("id da rifa "+ rifa.id);
               }
               else
                   rifas.push(rifa);
           }
           else
               rifas.push(rifa);
       });

       if(!rifas)
           return res.status(500).json("Não encotrado!");
       return res.json(rifas);
     }else{
        result = await knex<Rifa>('rifa').select("*").limit(limit).offset(offset);
        return res.json(result);
     }
});

routes.get('/rifa/:id', async (req, res) => {
    const idrifa = Number(req.params.id);
    const rifa = await knex<Rifa>('rifa').where('id', '=', idrifa).first();
    if(rifa){
        return res.json(rifa);
    }else
        return res.status(500).json("Não Encotrado");
});

//Mandar email
routes.get('/email', async (req, res) => {
    const email = req.query.email;
    if(email){
        const usuario = await knex<User>('usuario').where("email", String(email)).first();
        if(usuario){
        //Envio de Email
        let remetente = nodemailer.createTransport({
            host  : 'smtp.gmail.com',
            port  : 587,
            secure: false,
            auth  :{
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS 
            },
            tls: { rejectUnauthorized: false }
        });
        let detalhes = {
            from    : String(email),
            to      : String(usuario?.nome),
            subject : "Redefinir Senha, RifaTube",
            html    : "<div style='text-align : center; background-color: #444; padding: 2%; margin: 2% 5%;'> "+
                "<img style=' align-self: center; margin: 2% 10%; width : 30%;  border-radius: 8px' src='https://i.ibb.co/ZT29W0J/logo-2.png' alt='logo-2'/> <br/> "+
                "<h1 style='font-size: 1.5em; color: #f5f5f5'>Recuperação de Senha</h1> <br/>"+
                "<p style='color: #ccc'>Aqui está o link para redefinir sua senha</p> <br/> "+
                "<a style = 'font-size: 1.2em; text-decoration : none; color: #ddd' href='http://localhost:3000/novasenha/'"+ usuario.id +
                    "style = 'text-decoration:none; font-size: 1em; color: #fff; padding: 2%; border-radius: 8px; background-color: #6558f5;'> "+
                "Redefinir Senha</a>"+
            "</div>"
        };
        const info = await remetente.sendMail(detalhes);
        return res.json(info);
        }else
            return res.status(500).json('Esse Email não está cadastrado!');

    }else
        return res.status(500).json('Esse Email não existe!');
});

//Pagamentos via getnet
routes.post('/credito', async (req,res) => {
    const {usuarioid, campanhaid, total, numerocartao, nomecartao, validade, codigo} = req.body;
    const mesano = String(validade).split('/');
    //Header da Requisição
    let config = {
        "headers" : {
            "Accept"        : "application/json, text/plain, */*",
            "Content-Type"  : "application/x-www-form-urlencoded",
            "Authorization" : "Basic "+ process.env.PAY_AUTH,
        }
    };

    //Corpo da requisição
    const body = new URLSearchParams();
    body.append("scope", "oob");
    body.append("grant_type", "client_credentials");

   try {
        // == (1) authorization ==
        let access_token = await axios.post("https://api-sandbox.getnet.com.br/auth/oauth/v2/token", body , config).then( (res : Resp) => {
            console.log("Token " + res.data.access_token);
            return res?.data?.access_token;
        }).catch((error ) =>{
            console.log("Deu erro "+ error);
            return null ;
        });

        if(access_token){
            // (2) Tokenização Cartão
            config = {
                "headers" : {
                    "Accept"        : "application/json, text/plain, */*",
                    "Content-Type"  : "application/json",
                    "Authorization" : "Bearer "+ access_token,
                }
            };
            let token_card = await axios({method : "post", url : "https://api-sandbox.getnet.com.br/v1/tokens/card", data : { card_number : numerocartao }, headers: config.headers }).then(res => {
                const {number_token} = res.data;
                return number_token;
            }).catch(error => {
                console.log("Erro na tokenização " + error);
                return null;
            });
            console.log("token_card " + token_card);
            if(token_card){
                const bodyPay = {
                    "seller_id": process.env.PAY_SELLER_ID,
                    "amount": total,
                    "order": {
                    "order_id": String(campanhaid)
                    },
                    "customer": {
                    "customer_id": String(usuarioid),
                    "billing_address": {}
                    },
                    "device": {},
                    "shippings": [
                    {
                        "address": {}
                    }
                    ],
                    "credit": {
                    "delayed"            : false,
                    "save_card_data"     : false,
                    "transaction_type"   : "FULL",
                    "number_installments": 1,
                    "card": {
                        "number_token"    : token_card,
                        "cardholder_name" : nomecartao,
                        "expiration_month": mesano[0],
                        "expiration_year" : mesano[1],
                        "security_code"   : codigo
                    }
                    }
                };
                // == (3) Pagamento ==
                const status = await axios({method: "post", url:"https://api-sandbox.getnet.com.br/v1/payments/credit", data: bodyPay, headers: config.headers})
                .then(res => {
                    const {status} = res.data;
                    return status;
                }).catch(error => {
                    console.log("Erro no pagamento " + error.message);
                    return null ;
                });
                if(status)
                    return res.json(status); 
                else
                    return res.status(500).json("Não foi possivel efetuar o pagamento");
            }
            else
                return res.status(500).json("Erro na tokenização do cartão");  
        }
        else
            return res.status(500).json("Erro na autentificação do token");
   } catch (error) {
       const {status} = error.data;
       return res.json(status);
   }
}); 

routes.post('/boleto' ,async (req, res) => {
     const {nome, usuarioid, campanhaid, total,documentType,documentNumber, cep, logradouro, numeroCasa, bairro, localidade, uf} = req.body;
     //console.log([nome, usuarioid, campanhaid, total,documentType,documentNumber, cep, logradouro, numeroCasa, bairro, localidade, uf]);
    //Header da Requisição
    let config = {
        "headers" : {
            "Accept"        : "application/json, text/plain, */*",
            "Content-Type"  : "application/x-www-form-urlencoded",
            "Authorization" : "Basic " + process.env.PAY_AUTH,
        }

    };
    //Corpo da requisição
    let body = new URLSearchParams();
    body.append("scope", "oob");
    body.append("grant_type", "client_credentials");
    try {
        // == (1) authorization ==
        let access_token = await axios.post("https://api-sandbox.getnet.com.br/auth/oauth/v2/token", body , config).then( (res : Resp) => {
            return res.data.access_token;
        }).catch((error) =>{
            console.log("Deu erro na Autenticação "+ error);
            return null;
        });
        if(access_token){
            config.headers['Content-Type'] = "application/json; charset=utf-8";
            config.headers.Authorization = "Bearer "+ access_token;
            const bodyB = {
                "seller_id": process.env.PAY_SELLER_ID,
                "amount": String(total),
                "order": {
                  "order_id": String(campanhaid)
                },
                "boleto": {},
                "customer": {
                  "name": String(nome),
                  "document_type": String(documentType),
                  "document_number": String(documentNumber),
                  "billing_address": {
                    "street": String(logradouro),
                    "number": String(numeroCasa),
                    "district": String(bairro),
                    "city": String(localidade),
                    "state": String(uf),
                    "postal_code": String(cep)
                  }
                }
              };
              // == (2) Registro de Boleto ==
              let boleto = await axios({method: "post", url: "https://api-sandbox.getnet.com.br/v1/payments/boleto", data: bodyB, headers: config.headers}).then(res => {
                const {payment_id, status} = res.data;
                return {payment_id, status};
              }).catch(error => {
                  const {message} = error;
                  console.log(message || error);
                  return {payment_id : 0, status : "Error"}; 
              });

              if(boleto.payment_id !== 0){
                //== (3) Baixar Boleto ==
               return res.json({status : "APROVED",link : "https://api-sandbox.getnet.com.br/v1/payments/boleto/" +  boleto.payment_id + "/pdf", pagar_id : String(boleto.payment_id)});
              }
              else
                return res.status(500).json("Não foi possivel efetuar o pagamento");
        }
        else
            return res.status(500).json("Erro na autenticação");

    } catch (error) {
        console.log(error)
        return res.json(error);
    }
    return res.json('Não deu certo!');

});

routes.post('/pagouboleto', (req,res) => {
    return res.json(req.body);
});

export default routes;