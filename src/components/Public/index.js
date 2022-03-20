import React, {useEffect, useState, useContext} from 'react'
import Header from '../HeaderPublic'
import Home from "../Home";
import Login from "../Login"
import Register from "../Register"
import PasswordForget from '../PasswordForget'
import ErrorPage from '../ErrorPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute'
import Private from '../Private'
import NotAuthRoute from '../NotAuthRoute';

const Public = () => {

 
  
  return (
    <Router>
        <Header />
            <Switch>
              <Route exact path="/" component={Home} /> 
              <Route exact path="/connexion" component={Login} />
              <ProtectedRoute path='/admin' component={Private} />
              <Route exact path="/inscription" component={Register}  />
              <Route exact path="/mot-de-passe-oublie" component={PasswordForget}  />
              <Route component={ErrorPage} />
            </Switch>   
    </Router>
  )
}

export default Public;