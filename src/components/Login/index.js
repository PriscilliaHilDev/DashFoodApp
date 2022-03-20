import React, {useState, useContext, useRef, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form'
import { FirebaseContext } from '../../Firebase';
import { Route, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DisplayMenu } from '../../Redux/actions/menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function SignIn() {

  const classes = useStyles();
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();
  const {auth} = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const {menu} = useSelector(state => state)


  const [errorLog, setError]  = useState('')
  
   const getErrorEmail = (erreur) => {
     if(erreur && erreur.type === 'pattern'){
        return "Adresse e-mail incorrecte"
     }
     if(erreur && erreur.type === 'required'){
       return 'Votre adresse e-mail est requise'
     }

   }
  //  const disabled = () => {
  //   if(isSubmitted && isSubmitSuccessful){
  //     return true
  //   }
  //  }
  
 
 
 



   const getLoading = () => {
    return(
     <div style={{display: 'flex', padding:80, justifyContent: 'center'}}>
       <CircularProgress color="secondary"  />
     </div>
    )
  }
    



const loginForm = async (data) => {
 
  setLoading(true)
        await auth.signInWithEmailAndPassword(data.email, data.password).then((user)=>{
         
        }).catch((error) => {
          setLoading(false)
    
        switch (error.code) {

            case "auth/invalid-email":
                setError("Cette adresse email est invalide")
                break;
            
            case "auth/user-not-found":
                setError("Cet utilisateur n'existe pas")
                break;
    
            case "auth/wrong-password":
                setError("Votre mot de passe est invalide")
                break;
    
            default:
                break;
        } 
      }) 
  
}

 
   const handleClose = () => {
      dispatch(DisplayMenu(false))
    
   }
  return (
    <Container component="main" maxWidth="xs">
      <Dialog
                 open={menu}
                 onClose={handleClose}
                 aria-labelledby="draggable-dialog-title"
               >
                 <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                   Information
                 </DialogTitle>
                 <DialogContent>
                   <DialogContentText>
                     
                     <Typography variant="h4" component="h2" style={{textAlign:"center", color:'black', fontWeight:'bold'}}>
                        Accès refusé
                      </Typography>
                      <Typography variant="h5" component="h2" style={{textAlign:"center"}}>
                        Vous n'avez pas les droit nécessaires pour accéder à l'administration de MyFastFood
                      </Typography>
                   </DialogContentText>
                 </DialogContent>
                 <DialogActions>
                   <Button onClick={handleClose} color="primary">
                     Compris
                   </Button>
                 </DialogActions>
               </Dialog>
               
      <CssBaseline />
      <Box
        sx={{
          marginTop: '10%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{marginTop: 15}}>
          CONNEXION
        </Typography>

        {errorLog && 
        <div className={classes.root}>
          <Alert severity="error">{errorLog}</Alert>
        </div>
        }

        <Box component="form" onSubmit={handleSubmit(loginForm)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            autoComplete="email"
            error =  {errors.email && true}
            variant="outlined"
            helperText = {getErrorEmail(errors.email)}
            {...register('email', { required: true, pattern:{value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}})}
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label= "Votre mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', { required: true })}
            helperText = {errors.password && errors.password.type === "required" && 'Veuillez saisir votre mot de passe'}
            error =  {errors.password && true}
            variant="outlined"
            />
           
       
          { loading ?

            getLoading()

            :

            <Button type="submit" fullWidth variant="contained" style={{ marginTop:15, backgroundColor:'#ffb300' }}>
              Se connecter
           </Button>

          }
         
          <Grid container>
            <Grid item xs  style={{marginTop: 15}} >
              <Link to="/mot-de-passe-oublie" className='link'>
                Mot de passe oublié ?
              </Link>
            </Grid>
            {/* <Grid item>
              <Link to='/inscription'className='link' >
                Vous n'avez pas encore de compte ?
              </Link>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
      
    </Container>
  );
}