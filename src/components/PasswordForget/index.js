import React, {useState, useContext, useRef, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form'
import { FirebaseContext } from '../../Firebase';
import { useHistory } from "react-router-dom";
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function PasswordForget() {

  const classes = useStyles();

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();
  const {auth} = useContext(FirebaseContext);

  const [errorPass, setError]  = useState('')
  const [success, setSucces]  = useState('')

  const history = useHistory();

   const getErrorEmail = (erreur) => {
     if(erreur && erreur.type === 'pattern'){
        return "Adresse e-mail incorrecte"
     }
     if(erreur && erreur.type === 'required'){
       return 'Votre adresse e-mail est requise'
     }

   }


const mdpForget = async (data) => {
 
    await auth.sendPasswordResetEmail(data.email).then(()=>{
      setSucces("Un mail vous à été envoyé à l'adresse suivrante : "+ data.email + "pour réinitialiser votre mot de passe")
      data.email = ""
      setError('')

    }).catch((error) => {


    switch (error.code) {

        case "auth/invalid-email":
            setError("Cette adresse email est invalide")
            break;
        
        case "auth/missing-continue-uri":
            setError("Une URL de continuation doit être fournie dans la demande.")
            break;

        case "auth/wrong-auth/invalid-continue-uri":
            setError("L'URL de continuation fournie dans la demande n'est pas valide.")
            break;

        case "auth/user-not-found":
          setError("L'utilisateur n'existe pas.")
          break;

        default:
            break;
    } 
  }) 
}

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: '10%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {success &&
         <Alert severity="success">
            <AlertTitle>Bravo !</AlertTitle>
              {success} — 
              <strong><Link to="/connexion">Me connecter</Link></strong>
        </Alert>
        }
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Mot de passe oublié ?
        </Typography>

        {errorPass && 
        <div className={classes.root}>
          <Alert severity="error">{errorPass}</Alert>
        </div>
        }

        <Box component="form" onSubmit={handleSubmit(mdpForget)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
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
           
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 8}}>
            Réinitialiser le mot de passe
          </Button>
          <Grid container>
            
          </Grid>
        </Box>
      </Box>
      
    </Container>
  );
}