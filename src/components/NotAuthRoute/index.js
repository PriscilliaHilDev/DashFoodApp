import React, {useContext, useState, useEffect} from 'react'
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase';
import Loader from '../Loader';


const NotAuthRoute = ({component: Component, ...rest}) => {

  const {auth} = useContext(FirebaseContext)
  const [pending, setPending] = useState(true)
  const user = auth.currentUser

  useEffect(() => {
      setPending(false)
      
  }, [])
  return (
   
    <Route {...rest} render={props => (
      
        pending ? <Loader/>
        : <Component {...props} />

    )} />
  );
};

export default NotAuthRoute;