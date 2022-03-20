import React, {useContext, useEffect, useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../Firebase';
import { useParams } from 'react-router-dom';


export default function Details() {
  const {queryOneProduct} = useContext(FirebaseContext)
  const [oneProduct, setOneProduct] = useState([])
  const {id} = useParams();
 
  const getOneProduct = async () => {
    await queryOneProduct(id).onSnapshot((snapshot)=>{
     setOneProduct(snapshot.data())                           
 });    
}
  const useStyles = makeStyles((theme) => ({
    root: {
      height: '82vh',
    },
    image: {
      backgroundImage: `url(${oneProduct.image_url})`,
      backgroundRepeat: 'no-repeat',
      // backgroundColor:
      //   theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      wordBreak: 'break-word',
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
  }));

  const classes = useStyles();

  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

  useEffect(() => {
    const subscribeOneProduct = getOneProduct()
    return (
      subscribeOneProduct
    )
      
    
  }, [])

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div style={{margin:30}}>
          <Typography  style={{marginBottom:40, fontSize:40, textAlign:"center", fontWeight:'bold', textTransform:'uppercase', color:'#E38608'}}>
            {oneProduct.name}
          </Typography>
          <Typography variant="body1">
          
          <Typography  style={{marginBottom:60, fontSize:20,textAlign:'center' }}>
            {oneProduct.description}
            </Typography>
          </Typography>
          <Typography style={{ display:'flex', alignContent:'flex-end', flexDirection:'row', justifyContent:'space-between'}}>
          <Typography style={{fontSize:25, fontWeight:'bold', borderWidth:2, borderRadius:10,padding:20, backgroundColor:'#E38608', color:"#fff",borderStyle:'solid' }}>
            Prix : {oneProduct.price} €
          </Typography>
          {
            oneProduct.Available == "En stock" ?
            <Typography component="h1" variant="h5" style={{color:"#0E6404", fontWeight:'bold', marginTop:20}}>
            {oneProduct.Available} 
            </Typography>
            :
            <Typography component="h1" variant="h5" style={{color:'#A30505',  fontWeight:'bold', marginTop:20, marginLeft:120}}>
               {oneProduct.Available} 
            </Typography>
          }
         
          </Typography>
          <Typography variant="body2">
          <Typography component="h1" variant="h5">
            {/* Mise en vente le  : {oneProduct.createdAt.toDate().toLocaleString('fr-FR') }  */}
          </Typography>
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}