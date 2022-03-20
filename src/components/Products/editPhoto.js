import React, {useRef, useContext} from 'react';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { FirebaseContext } from '../../Firebase';
import {loadingPhoto, idChangePhoto} from "../../Redux/actions/loading"
import { useDispatch } from 'react-redux';


// verifier l'extension de l'image est valide
const extIsOk = (extension) => {
  switch(extension){
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':

          return true
          break;
      default:
          return false;
          break;
  }
}

const EditPhoto = ({id}) => {
  // useRef chercher fonctionnement
    const hiddenFileInput = useRef(null)

    // je recupere le service storage de firebase (a definir)
    const {storage, queryOneProduct} = useContext(FirebaseContext)
    const dispatch = useDispatch()

    // je recuperer le file
    const addImg = (e) => {

      const file = e.target.files[0];
      // je dispatch lid du produit
      dispatch(idChangePhoto(id))
      
      // si l'image n'a pas une extension valide, je stoppe lexecution du code
      if(!extIsOk(file.type)){
         return;
      }
      // astuce pour connaitre la taille d'un fichier file.size/1024/1024 < 1 mo

      const folderImg = `/images/products/${id}`;
      const buckImg = storage.ref(`${folderImg}`).child(file.name)
     
      
     const uploadTask = buckImg.put(file)
      uploadTask.on('state_changed', 
      (snapShot) => {

        // dispatch true
        dispatch(loadingPhoto(true))
      }, (err) => {
        
        // dispatch true si erreur stopper loadind traitement terminé
        dispatch(loadingPhoto(false))
  
      }, () => {
     
         buckImg.getDownloadURL()
         .then(async fireBaseUrl => {

             await queryOneProduct(id).update({image_url:fireBaseUrl}).then(()=>{
             
              dispatch(loadingPhoto(false))
             })
            
         })
      })
    }


  const handleClickInput = (e) => {
    hiddenFileInput.current.click()
}

// quand tu clique sur licone photo, grace à ref, le click sera declencher sur le linput qui est invisible
  return (
  <div>
      <input type="file" style={{display:'none'}} ref={hiddenFileInput}  onChange={addImg} />
      <AddAPhotoIcon onClick={handleClickInput} />
  </div>
      
  );
}

export default EditPhoto
