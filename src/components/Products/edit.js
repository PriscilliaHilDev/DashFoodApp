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


function AlertNotif(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Edit = ({id}) => {
  
  const {queryOneProduct, queryAllCategories} = useContext(FirebaseContext);

  const [oneProduct, setOneProduct] = useState([])

const [readCat, setReadCat] = useState([])

  const listCat = async() => {

    await queryAllCategories().onSnapshot((snapshot)=>{
      let allCategory = [];
      snapshot && !snapshot.empty && snapshot.forEach(element => {
        allCategory = ([...allCategory, {id:element.id, ...element.data()}]);
      });
    
      setReadCat(allCategory)
  })
  }


  
  const getOneProduct = async () => {
    await queryOneProduct(id).onSnapshot((snapshot)=>{
      setOneProduct(snapshot.data())   
    });    
  }

  useEffect(() => {
    const subcribCatData = listCat()
    return (
      subcribCatData
    )
    
  }, [])

  useEffect(() => {
    const getDataProduct = getOneProduct()
    return (
      getDataProduct
    )
    
  }, [])

  

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();

  const [success, setSuccess] = useState(false)
  const [problem, setProblem] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const updateForm =  (data) => {

    // cherche moi les objets dont la valeur n'est pas egale a undefined
    let dataUpdate = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined) )

      // Si on a au moins une données nouvelle a mettre a jour sinon on ne fait pas de mise a jour en requete
      if(Object.keys(dataUpdate).length > 0){
        const dataValideUp = Object.assign( dataUpdate, {dateUpdate: new Date()})
         queryOneProduct(id).update(
          dataValideUp
         ).then((res) => {
           
           setProblem(false)
           setSuccess(true)
           setDisabled(true)

         }).catch(() => {
           setProblem(true)
           setSuccess(false)

         })
      }
  }
  
  useEffect(() => {
    
  }, [success])

  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
      backgroundColor:'#ffb300'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
      color:"black"
    },
    root: {
        height: '100vh',
      },
      image: {
        backgroundImage: `url(${oneProduct?.image_url})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
          theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
      selectForm:{
         
          '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
          },
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

    const newCat = readCat.length > 0 && 
    readCat.map((item, index) =>{
      return(
          {value:item.id, label: item.name}
      )
    })
  
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [duration, setDuration] = useState(4000)
  
    const handleClickOpen = () => {
      setOpen(true);
      setDuration(4000)
    };
  
    const handleClose = () => {
      setOpen(false);
      setDuration(10)
    };

    const getErrorDescrip = (erreur) => {
      if(erreur && erreur.type === 'maxLength'){
         return "Votre description est trop longue, elle ne doit pas faire plus de 230 caractère"
      }
      if(erreur && erreur.type === 'validate'){
        return 'La description du produit est requise'
      }
    }
    const getErrorName = (erreur) => {
      if(erreur && erreur.type === 'maxLength'){
         return "Le nom de votre produit est trop long et ne doit pas dépasser 40 caractères"
      }
    
    }

    const activityInput = (e) => {
     setDisabled(false)
    }
    


    const handleCloseSuccess = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSuccess(false);
    };

    const handleCloseProblem= (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setProblem(false);
    };


       return (
    <div>
       <EditIcon onClick={handleClickOpen}/>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start"  onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              EDITER LE PRODUIT {oneProduct?.name?.toUpperCase()}
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={4} md={7} className={classes.image} />
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <div className={classes.snackbar}>
    
        <Snackbar open={success} autoHideDuration={duration} onClose={handleCloseSuccess}>
          <AlertNotif onClose={handleCloseSuccess} severity="success">
            Ce produit à été correctement mise à jour ! 
          </AlertNotif>
        </Snackbar>
        <Snackbar open={problem} autoHideDuration={duration} onClose={handleCloseProblem}>
          <AlertNotif onClose={handleCloseProblem} severity="error">
          Oups une erreur s'est produite, veuillez recommencer !          
          </AlertNotif>
        </Snackbar>
   </div>
        
        <div className={classes.paper}>
       
          <form className={classes.form} onSubmit={handleSubmit(updateForm)} noValidate autoComplete="off" >

            <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label= "Nom du produit"
                type="text"
                id="name"
                defaultValue={oneProduct?.name}
                {...register('name', { maxLength:{value:35}, validate: value => value !== ''})}
                helperText = {getErrorName(errors.name)}
                error =  {errors.name && true}
                variant="outlined"
                onChange={activityInput}

              />
              <Grid container spacing={5} className={classes.selectForm}>
              <Grid item xs={6}> 
              <TextField
                id="categorie"
                select
                label="Catégorie du produit"
                name='categorie'
                helperText="Please select your currency"
                variant="outlined"
                defaultValue={oneProduct?.category_id}
                {...register('category_id',{ validate: value => value !== ''})}
                helperText = {errors.category_id && errors.category_id.type === "validate" && 'Veuillez choisir une catégorie'}
                error =  {errors.category_id && true}
                onChange={activityInput}

              >
                {
                  newCat.length > 0 && newCat.map((item) => {
                    return(
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    )
                  })
                }
            </TextField>
              </Grid>
              <Grid item xs={6}>
              <TextField
                id="status"
                select
                label="Disponibilité"
                name='status'
                variant="outlined"
                defaultValue={oneProduct?.Available}
                {...register('Available', { validate: value => value !== ''})}
                helperText = {errors.Available && errors.Available.type === "validate" && 'Veuillez selectionner le status de ce produit'}
                error =  {errors.Available && true}
                onChange={activityInput}

              >
              <MenuItem value='Rupture de stock'>
                  Rupture de stock
              </MenuItem>
              <MenuItem  value='En stock'>
                  En stock
              </MenuItem>
            </TextField>
              </Grid>
            </Grid>
  
              <TextField
                margin="normal"
                required
                fullWidth
                name="price"
                label= "Prix du Produit en €"
                type="number"
                id="price"
                defaultValue={oneProduct?.price}
                {...register('price',  { validate: value => value !== ''})}
                helperText = {errors.price && errors.price.type === "validate" && 'Veuillez saisir le prix ce ce produit'}
                error =  {errors.price && true}
                variant="outlined"
                onChange={activityInput}

              />
                <TextField
                margin="normal"
                required
                fullWidth
                name="descrip"
                multiline
                rows={5}
                defaultValue={oneProduct?.description}
                label= "Description du produit"
                {...register('description', { maxLength: {value: 230}, validate: value => value !== ''})}
                helperText = {getErrorDescrip(errors.description)}
                error =  {errors.description && true}
                variant="outlined"
                onChange={activityInput}

              />

           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              disabled={disabled}
            >
              Enregistrer les modifications
            </Button>
          
          </form>
        </div>
      </Grid>
    </Grid>

      </Dialog>
    </div>
  );
}

export default Edit
