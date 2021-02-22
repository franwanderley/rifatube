
const meses  = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];
const mesesB = [ 31,29,31,30,31,30,31,31,30,31,30,31 ];

const getHoje = () => {
    //Vejo se está finalizadoD
    const hojeD = new Date();
    const dia = hojeD.getDate();
    const mes = hojeD.getMonth() + 1;
    const ano = hojeD.getFullYear();
    let formatterDay = String(dia);
    if(dia < 10)
         formatterDay = '0' + dia;
    
    let formatterMonth = String(mes);
    if(mes < 10)
     formatterMonth = '0' + mes;

    let hojeA = [formatterDay, formatterMonth, ano];
    return  hojeA.join('/');
};
const CompareDate = (date1 : string, date2 : string) => {
    const [dia1, mes1,ano1] = date1.split('/');
    const [dia2, mes2, ano2] = date2.split('/');

    // const n1 = Number(dia1) + Number(mes1) + Number(ano1);
    // const n2 = Number(dia2) + Number(mes2) + Number(ano2);
    // if(n1 >= n2)
    //     return true;
    // else
    //      return false;

     if(ano1 > ano2)
         return true;
     else if(ano1 === ano2){
         if(mes1 > mes2)
             return true;
         else if(mes1 === mes2){
             if(dia1 >= dia2)
                 return true;
             else
                 return false;
         }
         else
             return false;
     }else
         return false;

};

const venceuboleto = (dateR : string) => {
    const hoje = new Date();
    const [dia2, mes2, ano2] = dateR.split('/');

    const dRifa = new Date(mes2 +'/'+ dia2 +'/'+ ano2);
    // console.log([dRifa, hoje]);

    dRifa.setDate(dRifa.getDate() + 7);
    if(dRifa <= hoje)
        return dRifa.toLocaleString();
    else
        return 0;
};

export default {CompareDate, getHoje,venceuboleto};