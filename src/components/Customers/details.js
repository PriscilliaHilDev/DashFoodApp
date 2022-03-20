import React, {useState, useEffect, useContext, Fragment} from 'react'
import { useSelector } from 'react-redux'
import { FirebaseContext } from '../../Firebase';
import { useLocation } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



const Details =() => {

 

  const location = useLocation();
  const {email, adresse, phone, prenom, client, total, id, etat, idUser, date} = location.state
  console.log(location)
  const {queryAllProducts,queryOneOrder, queryDetailOrder} = useContext(FirebaseContext)
  const [readProducts, setReadProducts] = useState([])
  const [readDetailsOrder, setReadDetailsOrder] = useState([])
  const [detailProduits, setDetailProduits] = useState([])

  
  const listProducts = async() => {

    await queryAllProducts().onSnapshot((snapshot)=>{
      let allProducts = [];
     
      snapshot && !snapshot.empty && snapshot.forEach(element => {
          allProducts = ([...allProducts, {id:element.id, ...element.data()}]);
          // setLoading(false)
      })
      
          // setLoading(false)
      

      setReadProducts(allProducts)
   
      
 })
 
}

  useEffect(() => {

    const subscribeProducts = listProducts();
  
     return  (
      subscribeProducts
     )
       
    }, [])

    const listDetailOrder = async() => {

      await queryDetailOrder(id, idUser).onSnapshot((snapshot)=>{
        let allDetails = [];
       
        snapshot && !snapshot.empty && snapshot.forEach(element => {
          allDetails = ([...allDetails, {id:element.id, ...element.data()}]);
            // setLoading(false)
        })
        
            // setLoading(false)
        
  
        setReadDetailsOrder(allDetails)
     
        
   })
   
  }

  const getActions =(etat, id) => {
    if(etat == 'En cours'){
      return(
        <Fragment>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{marginRight:10}}
          onClick={()=>
            window.confirm(' Etes vour sure de vouloir changer le statut "En cours" de cette commande par le statut "Expedié ?" ? ') &&
            queryOneOrder(id).update(
              {status: "Expediée"}
            ).then((res) => {
              //  setDisabled(true)
              // console.log(res)
        
            }).catch(() => {
            
              console.log(id)
            })
            // console.log(id)
          }
        >     
         Valider  
        </Button> 
        
         <Button
         variant="contained"
         
         size="small"
         onClick={()=>
          window.confirm('Etes vour sure de vouloir changer le statut "En cours" de cette commande par le statut "Annulée ?" ?') &&
          queryOneOrder(id).update(
            {status: "Annulée"}
          ).then((res) => {
            //  setDisabled(true)
            // console.log(res)
      
          }).catch(() => {
            console.log(id)
          })
          // console.log(id)
        }
       >     
        Annuler  
       </Button> 
       </Fragment>
      )
    }
  }
    useEffect(() => {
  
     
      const subscribeDetails = listDetailOrder();
    
       return  (
        subscribeDetails
       )
         
      }, [])

     let allDetails = []
      readProducts.length > 0 && readDetailsOrder.length > 0 &&
      readProducts.forEach(produit => {
        readDetailsOrder.forEach(item => {
           if(item.product_id == produit.id){
            //  let allDetail = []
            // copie le contenu du tableau allDetail
            // ajoute
             allDetails = ([...allDetails, {quantite:item.quantity, ...produit}]);
            //  setDetailProduits(allDetail)
              //  return produit
           }
        })
        
      });
      // console.log('helllooo', allDetails)
      // faire un map sur all detail pour envoyé le nom prenom, quantité, total, client, idcommande, adresse, phone, date 


      function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
    
      const displayProducts = 
        allDetails.length > 0 && allDetails.map((item) => {
          return(
    <Card sx={{width:'35%', marginLeft:2, marginRight:2, marginBottom:5}}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="200"
        image={item.image_url}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" style={{fontWeight:'bold'}}>
          {item.name}
        </Typography>
        <div  style={{display:"flex",  justifyContent: 'space-around'}}>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          Qt : {item.quantite}
        </Typography>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          Prix : {item.price} €
        </Typography>
        </div>
      </CardContent>
    
    </Card>
        
          )
        })
 
    return (
      <div>   
               <h4 style={{fontSize:25, textAlign:'center', textTransform:"uppercase"}}
               > Les plats commandés n° {client} </h4>
      <div style={{display:"flex", background:"#ffb300",borderRadius:10, padding: 20, marginBottom: 20, flexDirection:'row', justifyContent:'space-around'}}>
      <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          {prenom}
        </Typography>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          {email}
        </Typography>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          {phone}
        </Typography>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          {adresse}
        </Typography>
        <Typography variant="body1" color="text.secondary" style={{fontWeight:'bold'}}>
          Le {date}
        </Typography>
      </div>
      <div style={{display:"flex",  justifyContent: 'space-around'}}>
        {displayProducts}
      </div>
      <div>
      <div style={{display:"flex",  justifyContent: 'center'}}>
      <Button
         variant="contained"
         size="small"
         style={{ marginLeft: 20, marginRight:20, width:150}}
       >     
        Annuler  
       </Button> 
       <Button
         variant="contained"
         size="small"
         style={{ marginLeft: 20, marginRight:20, width:150}}
       >     
        Expédiée  
       </Button> 
       <Button
         variant="contained"
         size="small"
         style={{ marginLeft: 20, marginRight:20, width:150}}
       >     
        Livrée  
       </Button> 
      </div>
      </div>
      <h4 style={{fontSize:30, textAlign:'right', textTransform:"uppercase"}}>Totale payé : {total} € </h4>

      </div>
 
    )
}

export default Details
