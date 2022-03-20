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


function AlertNotif(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Edit = ({id}) => {
  
  const {queryOneCategory} = useContext(FirebaseContext);

  const [oneCategory, setOneCategory] = useState([])

const [readCat, setReadCat] = useState([])

  const getOneCat = async () => {
    await queryOneCategory(id).onSnapshot((snapshot)=>{
      setOneCategory(snapshot.data())   
    });    
  }

 

  useEffect(() => {
    const getDataProduct = getOneCat()
    return (
      getDataProduct
    )
    
  }, [])

  

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();


  const [disabled, setDisabled] = useState(true)
  const updateForm =  (data) => {

    // cherche moi les objets dont la valeur n'est pas egale a undefined
    let dataUpdate = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined) )

      // Si on a au moins une données nouvelle a mettre a jour sinon on ne fait pas de mise a jour en requete
      if(Object.keys(dataUpdate).length > 0 && dataUpdate.typeOfCat !== oneCategory.typeOfCat){
        const dataValideUp = Object.assign( dataUpdate, {updateAt: new Date()})
        queryOneCategory(id).update(
          dataValideUp
         ).then((res) => {
           setDisabled(true)

         }).catch(() => {
          
         })
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

  
    const handleClickOpenEdit = () => {
      setOpenConfirm(true);
    };
  
    const handleCloseEdit = () => {
      setOpenConfirm(false);
    };

    const getErrorName = (erreur) => {
      if(erreur && erreur.type === 'maxLength'){
         return "Le nom de votre Categorie est trop long et ne doit pas dépasser 40 caractères"
      }
    
    }

    const activityInputName = (e) => {
      if(e.target.value !== oneCategory.name){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
    }
    

       return (
    <div>
       <EditIcon onClick={handleClickOpenEdit}/>
       <div className={classes.snackbar}>
    </div>
       <Dialog
              open={openConfirm}
              onClose={handleCloseEdit}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Suppression
              </DialogTitle>
              <Container className={classes.cardGrid} maxWidth="md">

              <form className={classes.form} onSubmit={handleSubmit(updateForm)} noValidate autoComplete="off" >

            <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label= "Nom de la catégorie"
                type="text"
                id="name"
                defaultValue={oneCategory?.name}
                {...register('name', { maxLength:{value:35}, validate: value => value !== ''})}
                helperText = {getErrorName(errors.name)}
                error =  {errors.name && true}
                variant="outlined"
                onInput={activityInputName}
              />
              
              <TextField
                id="typeOfCat"
                select
                label="Type"
                name='typeOfCat'
                fullWidth
                variant="outlined"
                defaultValue={oneCategory?.typeOfCat}
                {...register('typeOfCat', { validate: value => value !== ''})}
                helperText = {errors.typeOfCat && errors.typeOfCat.type === "validate" && 'Veuillez selectionner le status de ce produit'}
                error =  {errors.typeOfCat && true}
                disabled
              >
              <MenuItem value='Sucré'>
                Sucré
              </MenuItem>
              <MenuItem selected value='Salé'>
                Salé
              </MenuItem>
            </TextField>
            <DialogActions>
                <Button autoFocus  color="primary"  type='submit' disabled={disabled}>
                 Enregistrer
                </Button>
                <Button onClick={handleCloseEdit} color="primary">
                  Annuler
                </Button>
              </DialogActions>
            </form>
          </Container>
        
            </Dialog>
    </div>
  );
}

export default Edit
