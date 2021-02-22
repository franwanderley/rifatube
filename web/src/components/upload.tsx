import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './../styles/upload.css';
import { FiUpload } from 'react-icons/fi';


/*              === UPLOAD DE IMAGEM ===                        */
interface Props {
    onFileUploaded : (file : File) => void;//atributo para receber a foto
}
//Vai receber por parametro  <Dropzone onFileUploaded={setSelectedFile}/>
const Dropzone : React.FC<Props> = ({onFileUploaded}) => {
    const [selectedFileUrl,setSelectedFileUrl] = useState('');//Para mostrar a imagem selecionado
    const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0]; //Nome do arquivo
      
      onFileUploaded(file);//Vai guardar em selectedFile
      
      const fileUrl = URL.createObjectURL(file);//Criar um url para mostrar
      // Do something with the files
      setSelectedFileUrl(fileUrl);//guarda no state
  }, [onFileUploaded]) //Se dropzone muda este tambem mudara
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept : 'image/*' //Aceita apenas imagem com todo tipo de exensão 
  })

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
          selectedFileUrl
          ? <img src={selectedFileUrl} alt="Imagem do Usuario"/> /* Se tiver um arquivo selecionado vai mostrar img, senão o paragrafo */
          : (<p>
                <FiUpload/>
                Sua Imagem
            </p>)
      }
      
    </div>
  )
}
export default Dropzone;
