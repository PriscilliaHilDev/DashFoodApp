import React, {useContext} from 'react'
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase';


const ProtectedRoute = ({component: Component, ...rest}) => {

  const {auth} = useContext(FirebaseContext)
  const user = auth.currentUser

  return (

    // si je suis connect√©, j'ai acces a admin sinon direction index !
    // ce filtre permet de proteger l'acces a '/admin' quand je ne suis pas authentifi√©
    // ce filtre est utlisateur dans le composant public
   
    <Route {...rest} render={props => (
          user ?
            <Component {...props} />
            :
            <Redirect to='/' />
    )} />
  );
};

export default ProtectedRoute;