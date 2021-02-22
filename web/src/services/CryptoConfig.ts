import crypto from 'crypto';

 const CryptoConfig = {
     algoritmo : "aes-256-cbc", //Tipo de Algoritmo
     segredo   : "franciscowanderleyteixeradossant", //Chave para encriptar
     tipo      : "hex"
 }
 const iv = "1234567890abcdef";

    function criptografar(dados : string) {
        const cipher = crypto.createCipheriv(CryptoConfig.algoritmo, Buffer.from(CryptoConfig.segredo), iv);
        let codificado = cipher.update(dados);
        codificado = Buffer.concat([codificado, cipher.final()]);

        return codificado.toString('hex');

    };
    function descriptografar(criptografado : string){
        const decipher = crypto.createDecipheriv(CryptoConfig.algoritmo, Buffer.from(CryptoConfig.segredo), iv);
        let value = decipher.update(Buffer.from(criptografado, 'hex'));
        value = Buffer.concat([value, decipher.final()]);

        return value.toString();
    };

 export default  {criptografar, descriptografar};