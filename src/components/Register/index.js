import  React, {useState, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form'
import { FirebaseContext } from '../../Firebase';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const {auth, queryAddUser} = useContext(FirebaseContext);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitSuccessful, isSubmitted} } = useForm();
 
  const [errorRegist, setError] = useState('')
  const history = useHistory()

  const registerform = async (data) => {
    
    try{
      const {user} = await auth.createUserWithEmailAndPassword(data.email, data.password);
      history.push('/admin')
      await queryAddUser(user.uid, {superAdmin:false, email:user.email, lastName:data.lastName, firstName:data.firstName, createdAt:new Date()})
      .then((res) => {
         
          const user = auth.currentUser;
          return user.updateProfile({
            displayName: data.firstName + " " + data.lastName,
          })
        })

    } catch (error) {
      switch (error.code) {

      case "auth/invalid-email":
          setError("Cette adresse email est invalide")
          break;
      
      case "auth/email-already-in-use":
          setError("Cet adresse mail existe déjà ")
          break;

      case "Thrown if the password is not strong enough.":
          setError("Votre mot de passe est trop faible ")
          break;

      default:
          break;
        } 
    }
      
  }
       
  
    const disabled = () => {
     if(isSubmitted && isSubmitSuccessful){
       return 'true'
     }
    }

   const getErrorPassword = (erreur) => {
     if(erreur && erreur.type === 'minLength'){
        return "Votre mot de passe doit contenir un minimum de 7 caractères"
     }
     if(erreur && erreur.type === 'required'){
       return 'Un mot de passe est requis'
     }
     if(erreur && erreur.type === 'pattern'){
      return "Votre mot de passe doit contenir au moins une MAJUSCULE, une minuscule et un chiffre"
    }
   }

   const getErrorConfirmPassword = (erreur) => {
   
    if(erreur && erreur.type === 'required'){
      return 'Veuillez confirmer votre mot de passe'
    }
    if(erreur && erreur.type === 'validate'){
      return 'Vos mots de passe ne correspondent pas'
    }
  }

  const getErrorEmail = (erreur) => {
    if(erreur && erreur.type === 'pattern'){
       return "Adresse e-mail incorrecte"
    }
    if(erreur && erreur.type === 'required'){
      return 'Votre adresse e-mail est requise'
    }

  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: '2%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {errorRegist && 
          <div className={classes.root}>
            <Alert severity="error">{errorRegist}</Alert>
          </div>
        }

        <Box component="form" noValidate onSubmit={handleSubmit(registerform)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...register('firstName', { required: true })}
                helperText = {errors.firstName && errors.firstName.type === "required" && 'Veuillez saisir votre Prénom'}
                error =  {errors.firstName && true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                {...register('lastName', { required: true })}
                helperText = {errors.lastName && errors.lastName.type === "required" && 'Veuillez saisir votre Nom'}
                error =  {errors.lastName && true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error =  {errors.email && true}
                variant="outlined"
                helperText = {getErrorEmail(errors.email)}
                {...register('email', { required: true, pattern:{value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                // warning modifier le pattern ici ! trouver le bon
                {...register('password', { required: true, minLength: {value: 7}, pattern:{value:"#^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{7,}$#"}})}
                helperText = {getErrorPassword(errors.password)}
                error =  {errors.password && true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="ConfirmPassword"
                label="Confirm password"
                type="password"
                id="ConfirmPassword"
                autoComplete="current-password"
                {...register('ConfirmPassword', { required: true, validate: value => value === getValues('password')})}
                helperText = {getErrorConfirmPassword(errors.ConfirmPassword)}
                error =  {errors.ConfirmPassword && true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button type="submit" disabled={disabled()} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
    </Container>
  );
}