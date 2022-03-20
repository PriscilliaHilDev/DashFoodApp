import React, {useContext, useState, useEffect, Fragment} from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from "../Pagination"
import CircularProgress from '@material-ui/core/CircularProgress';
import { FirebaseContext } from '../../Firebase';
import CardActionArea from '@material-ui/core/CardActionArea';
import Edit from "./edit"
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import firebase from 'firebase/app'
import AddCategories from './addCategories';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import {loadingData, notifAction} from "../../Redux/actions/actionCategory"
import { useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';


const useStyles = makeStyles((theme) => ({  
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      },
  
}));
   


const Sucres = () => {

    const classes = useStyles()
    const dispatch = useDispatch()
    
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageFilter, setCurrentPageFilter] = useState(1)
    const [itemsByPage, setItemsByPage] = useState(10)
    const {queryCategoriesSucrees, queryOneCategory, functions, queryMultiDeleteCat} = useContext(FirebaseContext)
    const [readCategories, setReadCategories] = useState([])
    const [loading, setLoading] = useState(true);


    // const sms = () => {
    //   firebase.functions()
    //   .httpsCallable('sms');
     
    // }

    const [multiDisabled, setMultiDisabled] = useState(true);

    const ConfirmDelete = ({id, name}) => {
        const [openConfirm, setOpenConfirm] = React.useState(false);
        const deleteProduct = async (id) => {
    
          setLoading(true)
          await queryOneCategory(id).delete().then(() => {
            setLoading(false)
          })
        }
        const handleClickOpenDelete = () => {
          setOpenConfirm(true);
        };
      
        const handleCloseDelete = () => {
          setOpenConfirm(false);
        };
    
        return (
          <div>
            <DeleteForeverIcon onClick={handleClickOpenDelete}/>
           
            <Dialog
              open={openConfirm}
              onClose={handleCloseDelete}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Subscribe
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Supprimer la catégorie {name} ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={()=>deleteProduct(id)} color="primary">
                  Oui, supprimer !
                </Button>
                <Button onClick={handleCloseDelete} color="primary">
                  Non, annuler
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }


      const MultiDelete = ({tabDelete}) => {
        const [openConfirm, setOpenConfirm] = React.useState(false);

        const deleteMultiple =  () => {
          setLoadMultiDel(true)
          queryMultiDeleteCat(tabDelete).onSnapshot((snapshot)=>{
            snapshot && !snapshot.empty && snapshot.forEach(element => {
            element.ref.delete().then((res) =>{
              setLoadMultiDel(false)
            })
          
         })
        
         })
    
       }
        const handleClickOpenDelete = () => {
          setOpenConfirm(true);
         
          
        };
      
        const handleCloseDelete = () => {
          setOpenConfirm(false);
        };

    
        return (
          <div>
            <Fab disabled={multiDisabled} size="small"  color="secondary" title='Supprimer plusieurs catégories' >
              <DeleteForeverIcon  onClick={handleClickOpenDelete}/>
            </Fab>
           
            <Dialog
              open={openConfirm}
              onClose={handleCloseDelete}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Subscribe
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Etes sure de vouloir supprimer ces catégories ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={()=>deleteMultiple()} color="primary">
                  Oui, supprimer !
                </Button>
                <Button onClick={handleCloseDelete} color="primary">
                  Non, annuler
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
    
    const Edition = ({id}) => {
        return(
          <Edit id={id} />
        )
      }
    

    const getLoading = () => {
        return(
         <div style={{display: 'flex', padding:80, justifyContent: 'center'}}>
           <CircularProgress color="secondary"  />
         </div>
        )
      }
   

    const indexOfLastItem = currentPage*itemsByPage
    const indexOfFirstItem = indexOfLastItem - itemsByPage
    // const token = "fKaZ_dPZTP62dQJpLHonon:APA91bFhHzX-dYh_7IqglQTME5yr8V878eQZ9xT8-ODNchFkXdfuJf1M2ZwWW7_0QjXrKAGInxwcKqKOA43MMb8mK4o799LdOMUbcrd1rYai0U9qeF8SvF3XqxsTlQG-WLsW2EKiKf0M";


    const currentItems = readCategories.slice(indexOfFirstItem, indexOfLastItem)

    const getPage = (event, page) => {
        setCurrentPage(page)
    }

    const {actionCategory:{loadingData, notif}} = useSelector(state => state)

    const nbPages = Math.ceil(readCategories.length/itemsByPage)

    let multiDelCat = [];
    const handleChangeMultiDelete = (e) => {
  

      if(e.target.checked){
        multiDelCat.push(e.target.value)
        if(multiDelCat.length > 0 ){
          setMultiDisabled(false)
        }
      }else{
        const newMultiDel = multiDelCat.filter(item =>item !== e.target.value)
        multiDelCat = newMultiDel;
        setMultiDisabled(true)
       

      }
    }
    
    const listCategory = async() => {

       
        await queryCategoriesSucrees().onSnapshot((snapshot)=>{
        let allCategory = [];
        snapshot && !snapshot.empty ? snapshot.forEach(element => {
            allCategory = ([...allCategory, {id:element.id, ...element.data()}]);
            setLoading(false)
        }):
         
            setLoading(false)
        
        setReadCategories(allCategory)
        })
    }

   
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [loadingMultiDelete, setLoadMultiDel] = useState(false)




    const showCategories = () => {
    
        const CategoriesList = currentItems.length > 0 ? currentItems.map((item, index) => {
          return(
            <Grid justifyContent="center" style={{marginBottom:40}}>
            <Card sx={{ minWidth: 275 }}>
            <CardActionArea>
            <CardContent style={{ backgroundImage: "linear-gradient(#FB9903  30%,#FDB65D   100%)",}}>
            {/* style={{backgroundImage:`url("https://cdn.pixabay.com/photo/2017/01/16/17/45/pancake-1984716_1280.jpg")`,  backgroundSize: 'cover',
            backgroundPosition: 'center 40%'   }} */}
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Crée le : {item.createdAt?.toDate().toLocaleString('fr-FR')}
            </Typography>
            <Typography variant="h5" component="div" style={{fontWeight:'bold'}}>
                {item.name}
            </Typography>
            <Typography variant="body2">
                Mise à jour le : {item.updateAt?.toDate().toLocaleString('fr-FR')}
            </Typography>
            </CardContent>
         
            </CardActionArea>
            <CardActions>
                <Check id={item.id} />
                <Fab size="small"  color="secondary" aria-label="add" title={item.id}>
                    <Edition id={item.id} />
                </Fab>
                <Fab size="small"  color="secondary" aria-label="add" title={item.id}>
                    <ConfirmDelete id={item.id} name={item.name}/>
                </Fab>
            </CardActions>
        </Card>      
        </Grid>
   
     
          )
        })
        
          :
          <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
              Aucunes catégories trouvés
          </Typography>
          return(
            CategoriesList
          )
      }

    useEffect(() => {

        const subscribeCategories = listCategory()
        return  (
        subscribeCategories
        )
         
    }, [])
    
    // useEffect(() => {
      
      
    // }, [loadingMultiDelete])

  
    const Check = ({id}) => {

      return(
        
         ! notif ? 
          <Checkbox
          onInput={handleChangeMultiDelete}
          inputProps={{ 'aria-label': 'controlled', 'value': id}}
          /> 
          :
          <Checkbox
           disabled
          onChange={handleChangeMultiDelete}
          inputProps={{ 'aria-label': 'controlled', 'value': id}}
          /> 
        
      )
    }
    
    const [duration, setDuration] = useState(4000)
    const [success, setSuccess] = useState(false)
  
  

    const handleCloseSuccess = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      dispatch(notifAction(false))

    };

    const NotifAlert = () => {
      return(
      <div className={classes.snackbar}>
      <Snackbar open={notif} autoHideDuration={duration} onClose={handleCloseSuccess}>
      <AlertNotif onClose={handleCloseSuccess} severity="success">
        Cette catégorie à été enregistré ! 
      </AlertNotif>
    </Snackbar>
    </div>
      )
    }

    function AlertNotif(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
      const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      });

    return (
    <Fragment>
        <Container style={{padding:20}} maxWidth="md"> 
            <Typography component="h1" variant="h4" align="center" color="textPrimary" style={{padding:20}}>
                Les Categories sucrées 
            </Typography> 
     
              <Grid container  justifyContent="center">
                <Grid item>
                  <AddCategories categories={readCategories} typeCat='Sucré' title='AJOUTER UNE CATEGORIE SUCREE' />
                </Grid>
                <Grid item style={{marginLeft:20}}>
                  <MultiDelete tabDelete={multiDelCat} />
                </Grid>
            </Grid>
        </Container>
        <Container className={classes.cardGrid} maxWidth="md"> 
        
     <NotifAlert/>
   
                {
                    loading  || loadingData || loadingMultiDelete ?
                    getLoading()
                    :
                    <Fragment>
                    <Grid container spacing={4} style={{display:"flex", justifyContent:'space-around'}}>
                      {showCategories()}

                    </Grid>
                  <Pagination getPage={getPage} nbPages={nbPages}/>
                  </Fragment>
                }
                    
        </Container>
    </Fragment>
    )
}

export default Sucres
