import React, {useContext, useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Fab from '@material-ui/core/Fab';
import {useForm} from 'react-hook-form'
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import {FirebaseContext} from "../../Firebase"
import Box from '@material-ui/core/Box';
import { Alert, AlertTitle } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Fragment } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor:'#ffb300'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color:'black'
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '110%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
  cardImg:{
      height:250,
      width: 345,
      width: '110%',
      objectFit: "cover"
  },
  selectForm:{
    display: 'flex',
    justifyContent: 'center',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '23ch',
    },
    snackbar: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    
  },
}));


function AlertNotif(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddProduct = ({products}) => {
    const classes = useStyles();
    const {queryAllCategories, storage, queryOneProduct, queryAllProducts} = useContext(FirebaseContext);
    const [errorName, setErrorName] = useState('')
    const [file, setFile] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorImg, setErrorImg] = useState('')
    const [success, setSuccess] = useState(false)


    const hiddenFileInput = useRef(null)
    const { register, handleSubmit, reset, setValue, 	clearErrors, formState: { errors, isSubmitSuccessful, isSubmitted } } = useForm();

    const [openNotif, setOpenNotif] = React.useState(false);
    const [duration, setDuration] = useState(4000)
    
  
    const handleCloseNotif = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenNotif(false);
    };

    const handleCloseSuccess = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSuccess(false);
    };


    const errorNameData = (e) =>  {
      if(products.length > 0 ){
        products.filter(item => {
          if(item.name === e.target.value){
            return setErrorName(e.target.value)
          }
        })
      }
    }

    const [disabled, setDisabled] = useState(false)

    const addForm =  (data) => {
      if(currentImg === ""){
        setOpenNotif(true)
      }

      // si l'image n'est pas null et que le nom du produit n'existe pas deja en base de données
      if(currentImg !== "" && data.name !== errorName){
        setOpenNotif(false)
        setLoading(true)
        setDisabled(true)
        queryAllProducts().add({
          name: data.name,
          category_id: data.category_id,
          price:data.price,
          description:data.description,
          Available: data.Available,
          image_url: '',
          createdAt: new Date()
        }).then((res) => {
          const folderImg = `/images/products/${res.id}`;
          const buckImg = storage.ref(`${folderImg}`).child(file.name)
          const uploadTask = buckImg.put(file)
         
          uploadTask.on('state_changed', 
          (snapShot) => {
            setLoading(true)
            setErrorImg('')
          }, (err) => {
            setLoading(true)
            setErrorImg(err)
          }, () => {
             setErrorImg("")
             buckImg.getDownloadURL()
             .then(async fireBaseUrl => {
                 await queryOneProduct(res.id).update({image_url:fireBaseUrl}).then(() => {
                   setLoading(false)
                   setSuccess(true)
                   reset()
                   setDisabled(false)
                   setCurrentImg('')

                 })
             })
          })
          
        })
      }

    }


    const [refresh, setRefresh] = useState(false)
    const history = useHistory()

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
   
      if(!open){
        clearErrors()
      }

    }, [open])



  
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


  useEffect(() => {
    const subcribCatData = listCat()
    return (
      subcribCatData
    )
    
  }, [])


  // boucler sur les menu en option qui doivent avoir lapparence d'un objet individuel pour chaque categorie avec une valeur et un label
  const newCat = readCat.length > 0 && 
  readCat.map((item, index) =>{
    return(
        {value:item.id, label: item.name}
    )
  })
  
    const handleClickOpen = () => {
      setOpen(true);
      setCurrentImg("")
      setDuration(4000)
    };
  
    const handleClose = () => {
      setOpen(false);
      setDuration(10)
      setRefresh(true)
    };

    const handleClickInput = (e) => {
        hiddenFileInput.current.click()
    }

    const [currentImg, setCurrentImg] = useState('')
    
    const addImg = (e) => {
      const file = e.target.files[0];
      setFile(e.target.files[0])
      if(file){
          setCurrentImg(URL.createObjectURL(file))
      }
    }

    const getErrorDescrip = (erreur) => {
        if(erreur && erreur.type === 'maxLength'){
           return "Votre description est trop longue, elle ne doit pas faire plus de 230 caractère"
        }
        if(erreur && erreur.type === 'required'){
          return 'La description du produit est requise'
        }
      }
      const getErrorName = (erreur) => {
        if(erreur && erreur.type === 'maxLength'){
           return "Le nom de votre produit est trop long et ne doit pas dépasser 40 caractères"
        }
        if(erreur && erreur.type === 'required'){
            return 'Le nom du produit est requis'
          }
        if(erreur && erreur.type === 'validate'){
          return 'Ce produit figure déjà dans votre liste'
        }
      
      }
      
      const previewImg = currentImg !== "" &&  
                        <Card >
                          <img className={classes.cardImg} src={currentImg}/>
                        </Card>
    return (
        <div>
          <Button variant="contained" color="secondary" onClick={handleClickOpen}>
            CREER UN NOUVEAU PRODUIT
          </Button>
          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
               { disabled ?
               <div></div>
               :
               <Fragment>
               <IconButton edge="start"  onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  Fermer
                </Typography>
                </Fragment>
               }
              </Toolbar>
            </AppBar>
            <List>
            <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: '10%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
          
             <Grid item xs={10} square>
              <Typography component="h1" variant="h5">
                  Création d'un nouveau produit 
              </Typography>
              
                  { 
                    !loading ?
                      previewImg
                    :
                    <div style={{display: 'flex', padding:50, justifyContent: 'center'}}>
                      <CircularProgress color="secondary"  />
                    </div>
                   }
                     
                {
                  loading ?
                  <div></div>
                  :
                  <div style={{display: 'flex', padding:30, justifyContent: 'center'}}>
                    <input type="file" style={{display:'none'}} ref={hiddenFileInput}  onChange={addImg} />
                    <Fab size="large" >
                      <Tooltip title="Cliquer ici pour ajouter une image" aria-label="">
                          <AddAPhotoIcon onClick={handleClickInput} />
                      </Tooltip>
                    </Fab>
                </div>
                }
                <div className={classes.snackbar}>
     
                <Snackbar open={openNotif} autoHideDuration={duration} onClose={handleCloseNotif}>
                  <AlertNotif onClose={handleCloseNotif} severity="error">
                    Veuillez ajouter une image pour creer ce produit 
                  </AlertNotif>
                </Snackbar>
                <Snackbar open={success} autoHideDuration={duration} onClose={handleCloseSuccess}>
                  <AlertNotif onClose={handleCloseSuccess} severity="success">
                    Ce produit à été enregistré ! 
                  </AlertNotif>
                </Snackbar>
      
              </div>
              
               </Grid>
   
        <form onSubmit={handleSubmit(addForm)} noValidate sx={{ mt: 1 }}>
        <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label= "Nom du produit"
                type="text"
                id="name"
                onInput={errorNameData}
                {...register('name', { maxLength:{value:27}, required:true, validate: value => value !== errorName})}
                helperText = {getErrorName(errors.name)}
                error =  {errors.name && true}
                variant="outlined"
              />
              <Grid  spacing={2} className={classes.selectForm}>
              <Grid item xs={6}> 
              <TextField
                id="categorie"
                select
                label="Catégorie"
                name='categorie'
                variant="outlined"
                {...register('category_id',{required:true})}
                helperText = {errors.category_id && errors.category_id.type === "required" && 'Veuillez choisir une catégorie'}
                error =  {errors.category_id && true}
              >
                {
                  newCat.length > 0 ? newCat.map((item) => {
                    return(
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    )
                  })
                  :
                  <MenuItem key="" value="">
                        Aucunes catégories trouvées
                  </MenuItem>

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
                {...register('Available', { required:true})}
                helperText = {errors.Available && errors.Available.type === "required" && 'Veuillez selectionner le status de ce produit'}
                error =  {errors.Available && true}
              >
              <MenuItem value='Rupture de stock'>
                  Rupture de stock
              </MenuItem>
              <MenuItem selected value='En stock'>
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
                {...register('price',  {required:true})}
                helperText = {errors.price && errors.price.type === "required" && 'Veuillez saisir le prix ce ce produit'}
                error =  {errors.price && true}
                variant="outlined"
              />
                <TextField
                margin="normal"
                required
                fullWidth
                name="descrip"
                multiline
                rows={5}
                label= "Description du produit"
                {...register('description', { maxLength: {value: 230}, required:true})}
                helperText = {getErrorDescrip(errors.description)}
                error =  {errors.description && true}
                variant="outlined"
              />

           
         
          <Button type="submit" disabled={disabled} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Enregistrer
          </Button>
         
        </form>
        </Box>
               </Container>
            
               
            </List>
          </Dialog>
        </div>
      );
}

export default AddProduct
