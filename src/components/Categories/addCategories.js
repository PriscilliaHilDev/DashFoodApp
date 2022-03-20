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

function AlertNotif(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const AddCategories = ({categories, typeCat, title}) => {
  
  const {queryAllCategories} = useContext(FirebaseContext);

  const { register, handleSubmit, clearErrors, reset, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();

  const [errorName, setErrorName] = useState(null)

  const errorNameData = (e) =>  {
    
    if(categories.length > 0 ){
      categories.filter(item => {
        if(item.name === e.target.value){
          return setErrorName(e.target.value)
        }
      })
    }
    if(e.target.value !== null){
      setDisabled(false)
    }

  }

  const dispatch = useDispatch()

  const [disabled, setDisabled] = useState(true)
  const addForm =  (data) => {
    handleCloseAdd()


    if(data.name !== errorName){
      // setOpenNotif(false)
      // setLoading(true)
      // setDisabled(true)
      dispatch(loadingData(true))

      queryAllCategories().add({
        name: data.name,
        createdAt: new Date(),
        updateAt:new Date(),
        typeOfCat:typeCat
      }).then((res) => {
        dispatch(loadingData(false))
        dispatch(notifAction(true))
        reset()
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

  
    const handleOpenAdd = () => {
      setOpenConfirm(true);
    };
  
    const handleCloseAdd = () => {
      setOpenConfirm(false);
      setDisabled(true)
    };

    const getErrorName = (erreur) => {
      if(erreur && erreur.type === 'maxLength'){
         return "Le nom de votre catégories est trop long et ne doit pas dépasser 40 caractères"
      }
      if(erreur && erreur.type === 'required'){
          return 'Le nom de la catégorie est requis'
        }
      if(erreur && erreur.type === 'validate'){
        return 'Cette catégorie figure déjà dans votre liste'
      }
    
    }
    

       return (
    <div>
  
      <Button variant="contained" color="secondary" onClick={handleOpenAdd}>
           {title}
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
                name="name"
                label= "Nom de la catégorie"
                type="text"
                id="name"
                {...register('name', { maxLength:{value:35}, required:true, validate: value => value !== errorName})}
                helperText = {getErrorName(errors.name)}
                error =  {errors.name && true}
                variant="outlined"
                onInput={errorNameData}
              />
              

              <TextField
                id="typeOfCat"
                select
                label="Type"
                name='typeOfCat'
                fullWidth
                variant="outlined"
                defaultValue={typeCat}
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

export default AddCategories
