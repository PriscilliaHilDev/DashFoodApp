import React, {useContext, useEffect, useState, Fragment} from 'react'
import { makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SideBar from "../SideBar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IsLoginRoute from '../IsLoginRoute'
import { FirebaseContext } from '../../Firebase';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../Login'
import Register from "../Register"
import PrivateRoute from '../PrivateRoute';
import Products from '../Products'
import HomeAdmin from "../HomeAdmin"
import Home from "../Home"
import DetailProduct from "../Products/detail"
import EditProduct from "../Products/edit"
import ErrorPage from '../ErrorPage'
import Footer from '../Footer';
import Categories from "../Categories";
import Sucres from '../Categories/sucres';
import Sales from '../Categories/sales';
import Admins from '../Admins'
import Customers from "../Customers";
import Orders from '../Customers/orders'
import Account from '../Account';
import DetailsOrder from "../Customers/details"

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    
  }));

const Private = () => {


  const {auth} = useContext(FirebaseContext);
  const user = auth.currentUser



  

    const classes = useStyles();
  return (
    
    <Router>
       <div className={classes.root}>
            <SideBar/>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                     {user && <IsLoginRoute  exact path="/inscription" component={Register} />}
                     {user && <IsLoginRoute  exact path="/connexion" component={Login} /> }
                     {user && <IsLoginRoute  exact path="/" component={Home} />}
                     {user && <PrivateRoute exact path="/admin" component={HomeAdmin} />}
                     {user &&  <PrivateRoute exact path="/admin/produits" component={Products} />}
                     {user &&  <PrivateRoute exact path="/admin/categories" component={Categories} />}
                     {user &&  <PrivateRoute exact path="/admin/produit/:id" component={DetailProduct} />}
                     {user &&  <PrivateRoute exact path="/admin/produit/edit/:id" component={EditProduct} />}
                     {user &&  <PrivateRoute exact path="/admin/categories/sucrees" component={Sucres} />}
                     {user &&  <PrivateRoute exact path="/admin/categories/salees" component={Sales} />}
                     {user &&  <PrivateRoute exact path="/admin/administrateurs" component={Admins} />}
                     {user &&  <PrivateRoute exact path="/admin/utilisateurs" component={Customers} />}
                     {user &&  <PrivateRoute exact path="/admin/utilisateurs/:id" component={Orders} />}
                     {user &&  <PrivateRoute exact path="/admin/utilisateurs/commandes/details" component={DetailsOrder} />}
                     {user &&  <PrivateRoute exact path="/admin/mon-compte" component={Account} />}
                     {user &&  <PrivateRoute component={ErrorPage}/>}
                    </Switch>
                </main>
              
       </div>
       <Footer/>
    </Router>
  )
}

export default Private;