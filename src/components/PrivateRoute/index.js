import React, {useContext, useState, useEffect} from 'react'
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase';
import Home from "../Home"
import { useHistory } from "react-router-dom";
import Loader from '../Loader';
import { useDispatch } from 'react-redux';
import { DisplayMenu } from '../../Redux/actions/menu';

const PrivateRoute = ({component: Component, SideBar, ...rest}) => {

  const {auth, getCurrentUser} = useContext(FirebaseContext);
  const user = auth.currentUser
  const dispatch = useDispatch()


  const [userAuth, setUserAuth] = useState([])

    const getUser = async() => {
      await getCurrentUser(user.uid).onSnapshot((snapshot)=>{
        setUserAuth(snapshot.data().roles)  
      })
    }

    useEffect(() => {
      const subscribeUser = getUser()
      return  (
        subscribeUser
      )
      
    }, [])

    const verif = userAuth.length > 0 ? userAuth.includes('ROLE_ADMIN') : null

    // useEffect(() => {

    //   const subscribeAdmins = listAdminsActif()
    //   return  (
    //     subscribeAdmins
    //   )
      
    // }, [])

  // const history = useHistory()
  // const [adminActifs, setAdminActifs] = useState([]);
  

  //   const listAdminsActif = async() => {
 
  //     await queryActifsAdmins().onSnapshot((snapshot)=>{
  //       let allAdminsActifs = [];
  //       snapshot && !snapshot.empty && snapshot.forEach(element => {
  //         allAdminsActifs = ([...allAdminsActifs, element.data().email]);
  //           console.log(allAdminsActifs)
  //     })
  //         setAdminActifs(allAdminsActifs)
  //     })
  //   }
  //   useEffect(() => {

  //     const subscribeAdmins = listAdminsActif()
  //     return  (
  //       subscribeAdmins
  //     )
      
  //   }, [])


  //   const verif = adminActifs.length > 0 ? adminActifs.includes(user?.email) : null
  //   const dispatch = useDispatch()

  console.log(verif)


    const verifAuth = (composant) => {

      // si un user est connecté et que les données ne sont pas encore chargé, on affiche un loading
      if(user && verif == null){
        return(<Loader/>)
      }

     // Si un utilisateur est connecté et qu'il a le role admin, il a accès au contenu de l'admin
      if(user && verif ){
        dispatch(DisplayMenu(false))

        return composant
      }

      // Si il y a un utilisateur et qu'il n'a pas le role Admin, 
      if(user && !verif){
          
        // On déconnecte l'utilisateur qui sera redirigé à la page d'accueil, 
        // On dispatch l'indicateur qui devra déclencher un modale pour expliquer à l'utilisateur qu'il n'a pas les droits necessaires
       
        auth.signOut().then(()=>{
          dispatch(DisplayMenu(true))
        
        })
      }
     // Si aucun utilisateur n'est authentifié à l'url "/admin", il sera redirigé à la page de connexion
      if(!user){
        return <Redirect to='/connexion' />
      }
    }


  return (
    <Route {...rest} render={props => (
      
       verifAuth(<Component {...props} />)
      // auth ?
      // <Component {...props} />
      // :
      // <Redirect to='/connexion'/>
  )} />
);
};

export default PrivateRoute;