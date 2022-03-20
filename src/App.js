import React, {useEffect, useState, useContext, Fragment} from 'react'
import './App.css';
import Public from './components/Public'
import Private from "./components/Private";
import PrivateRoute from './components/PrivateRoute';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { frFR } from '@mui/x-data-grid';
import { FirebaseContext } from './Firebase';
import Loader from './components/Loader'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// application personnalisé du theme fournit par 
// matérial UI + traduction de dataGrid (list sous forme de tableau =>
// voir les composants customers et orders)
const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#ffb300',
      },
      secondary: {
        main: '#ffb300',
      },
      status: {
        danger: '#ad1457',
      },
  
    },
  },
  frFR,

);

// const theme = createTheme(
//   {
//     palette: {
//       primary: {
//         light: '#757ce8',
//         main: '#3f50b5',
//         dark: '#002884',
//         contrastText: '#fff',
//       },
//       secondary: {
//         light: '#ff7961',
//         main: '#f44336',
//         dark: '#ba000d',
//         contrastText: '#000',
//       },
//     },
//   },
//   frFR,
// );



const App = () => {

  // récupération du service auth de firebase à partir du contexte firebase
  const {auth} = useContext(FirebaseContext)

  // initialisation des variables userAuth 
  const [userAuth, setUserAuth] = useState({})
  const [pending, setPending] = useState(true)
  


  // au montage de l'application, écouter les changement de statut d'autentification de l'utilisateur
  useEffect(  () => {
  
    const authChange =  auth.onAuthStateChanged(userCurrent =>{

      // stocker les informations lié à l'utilisateur authentifié
          setUserAuth(userCurrent)

      // afficher un loading d'une seconde avant le rendu final du contenu l'application
          setTimeout(() => {
            setPending(false)
          }, 1000);
    })

    // demontage du composant App
    return () => {
      authChange()
    }
  }, [])


  // controller le contenu de l'application
  const renderAccess = () => {

    // si il n'y a pas encore d'utilisation authentifié, on affiche un laoding 
    if(pending && userAuth == null){
      return <Loader/>
    }

    // si il y a un utilisateur, on affiche le loading pendant une seconde avant d'afficher le contenu de l'application
    if(pending && userAuth !== null){
      return <Loader/>
    }
  
    // Si il n'y a pas d'utilisateur et que le seconde de chargement est passé, on afficher le contenu public de l'application
    if(userAuth == null && !pending ){
      
      return <Public/>
    }

    // Si il y a  un utilisateur et que le seconde de chargement est passé, on afficher le contenu privé de l'application
    if(userAuth !== null && !pending){
      return <Router>
                <Switch>
                    <PrivateRoute component={Private} />
                </Switch>
              </Router>
    }
  }
 
  return (
    <ThemeProvider theme={theme}>
     
     {renderAccess()}

    </ThemeProvider>
  )
}

export default App;