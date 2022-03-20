import React, {useContext} from 'react'
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase';
import Private from '../Private';

const IsLoginRoute = ({component: Component, ...rest}) => {

  const {auth} = useContext(FirebaseContext)
  const user = auth.currentUser


  // si connecté je ne peux pas aller sur les pages accessible quand je ne suis pas connecté !
  const verifAuth = (component) => {
     if(user){
       return <Redirect to='/admin' />
     }
     if(!user){
       return component
     }
  }

  return (
   
    <Route {...rest} render={props => (
      verifAuth(<Component {...props} />)
    )} 
    />
  );
};

export default IsLoginRoute;