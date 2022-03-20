import React, {useEffect, useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import {useForm} from 'react-hook-form'
import { FirebaseContext } from '../../Firebase';
import MenuItem from '@material-ui/core/MenuItem';
import { Alert, AlertTitle } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Container from '@material-ui/core/Container';
import {loadingData, notifAction} from "../../Redux/actions/actionCategory"
import { useDispatch } from 'react-redux';
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';


function AlertNotif(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Add = ({list}) => {
  
  const {auth, queryAddUser} = useContext(FirebaseContext);

  const { register, handleSubmit, clearErrors, reset, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();


  const [errorEmail, setErrorEmail] = useState(null)


  const errorEmailData = (e) =>  {
    
    if(list.length > 0 ){
      list.filter(item => {
        if(item.email === e.target.value){
          return setErrorEmail(e.target.value)
        }
      })
    }
    if(e.target.value !== null){
      setDisabled(false)
    }

  }


  
  const sendEmail = (pass, email) => {
  

    var templateParams = {
      to_name: 'priscillia_hillion@outlook.fr',
      from_name: 'moi meme the boss girl',
      message: `Afin de vous identifier veuillez acceder à ce lien : (link)
       Vos identifiants sont les suivants :
       Email : ${email}
       Mot de passe : ${pass}`
    };
    init("user_fnZE6Y6JbzAdYWDLIGi5w");
    
    emailjs.send('service_dgpy2rs', 'template_rtlyagn', templateParams)
      .then((result) => {
      }, (error) => {
      });
    
  };


  const [error, setError] = useState(null);

  const dispatch = useDispatch()

  const [disabled, setDisabled] = useState(true)


  const addForm = async (data) => {
    handleCloseAdd()

    if(data.email !== errorEmail){
      
      setDisabled(true)
      // dispatch(loadingData(true))
      let password = Math.random().toString(36).slice(-8);
    

      try{
        const {user} = await auth.createUserWithEmailAndPassword(data.email, password);
        await queryAddUser(user.uid, {admin:true, status:'actif', superAdmin:false, email:user.email, lastName:data.prenom, firstName:data.nom, createdAt:new Date()})
        .then((res) => {

            // dispatch(loadingData(false))
            // dispatch(notifAction(true))
            reset() 
            const user = auth.currentUser;
            user.updateProfile({
              displayName: data.firstName + " " + data.lastName,
            })
            sendEmail(password, user.email)

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
}


 
  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
        height: '100vh',
      },
   
      paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
     
        snackbar: {
          width: '100%',
          '& > * + *': {
            marginTop: theme.spacing(2),
          },
        },
        absolute: {
          position: 'absolute',
          bottom: theme.spacing(2),
          right: theme.spacing(3),
        },
      
    }));


  
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

  
    const handleOpenAdd = () => {
      setOpenConfirm(true);
    };
  
    const handleCloseAdd = () => {
      setOpenConfirm(false);
      setDisabled(true)
    };

    const getErrorEmail = (erreur) => {

       if(erreur && erreur.type === 'pattern'){
        return "Adresse e-mail incorrecte"
     }
     if(erreur && erreur.type === 'validate'){
      return 'Cette adresse-mail figure déjà dans votre liste'
    }
      if(erreur && erreur.type === 'required'){
          return 'Le nom de la catégorie est requis'
        }
      if(error !== null){
        return error;
      }
    
    }


    const getErrorPrenom = (erreur) => {
    
      if(erreur && erreur.type === 'required'){
          return 'Le nom de la catégorie est requis'
        }
     
    }

    const getErrorNom = (erreur) => {
      
      if(erreur && erreur.type === 'required'){
          return 'Le nom de la catégorie est requis'
        }
    }
    
    
    

       return (
    <div>
  
      <Button variant="contained" color="secondary" onClick={handleOpenAdd}>
           Creer un Administrateur
      </Button>
       <div className={classes.snackbar}>
    </div>
       <Dialog
              open={openConfirm}
              onClose={handleCloseAdd}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Suppression
              </DialogTitle>
              <Container  maxWidth="md">

              <form className={classes.form} onSubmit={handleSubmit(addForm)} noValidate autoComplete="off" >

            <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label= "Nom de la catégorie"
                type="text"
                id="email"
                {...register('email', { required:true, validate: value => value !== errorEmail,  pattern:{value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}})}
                helperText = {getErrorEmail(errors.email)}
                error =  {errors.email && true}
                variant="outlined"
                onInput={errorEmailData}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="nom"
                label= "Nom de l'Administrateur"
                type="text"
                id="nom"
                {...register('nom', { maxLength:{value:35}, required:true})}
                helperText = {getErrorNom(errors.nom)}
                error =  {errors.nom && true}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="prenom"
                label= "Prénom de l'administrateur"
                type="text"
                id="prenom"
                {...register('prenom', { required:true})}
                helperText = {getErrorPrenom(errors.prenom)}
                error =  {errors.prenom && true}
                variant="outlined"
              />
              

              
            <DialogActions>
                <Button autoFocus  color="primary"  type='submit' disabled={disabled}>
                 Enregistrer
                </Button>
                <Button onClick={handleCloseAdd} color="primary">
                  Annuler
                </Button>
              </DialogActions>
            </form>
          </Container>
        
            </Dialog>
    </div>
  );
}

export default Add
