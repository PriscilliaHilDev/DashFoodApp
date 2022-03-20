import React, {useEffect, useContext, useState, Fragment} from 'react';
import { DataGrid} from '@mui/x-data-grid';
import Grid from '@material-ui/core/Grid';
import { FirebaseContext } from '../../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";


 
const Orders = () => {

const location = useLocation();

const {email, adresse, phone, nom, prenom} = location.state
console.log(location.state)

  const history = useHistory()
  const {id} = useParams();
  console.log(email, 'email')


  const [readOrders, setReadOrders] = useState(null);
  const { queryOrders, queryOneOrder} = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);

  const {user} = useSelector(state => state)
    

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

  const listOrders = async() => {
 
    await queryOrders(id).onSnapshot((snapshot)=>{

        let allOrders = [];
        let i = 0;
     
      if(snapshot && !snapshot.empty){

        snapshot.forEach(element => {
          allOrders = ([...allOrders, {idData:element.id, ...element.data()}]);
          i++;
        })
       
      }else{ 
        setLoading(false)
      }
      setReadOrders(allOrders)
      setLoading(false)
     
    })
}

console.log(user)

  useEffect(() => {

    const subscribeOrders = listOrders()
    return  (
      subscribeOrders
    )
    
  }, [])





  
  const dataOrders = readOrders?.map((val, index) => {
    return({id:index+1, email: email, date:timeConverter(val.createdAt),...val}) 
})

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

  if(etat == 'Livrée' || etat == 'Annulée'){
    return(
     <h3 style={{color:"grey"}}>   ---  </h3> 
    )
  }
  
  if(etat == 'Expédiée'){
    return(
      <Button
      variant="contained"
      
      size="small"
      onClick={()=>
       window.confirm('Etes vour sure de vouloir changer le statut "Expédiée" de cette commande par le statut "Livrée ?" ?') &&
       queryOneOrder(id).update(
         {status: "Livrée"}
       ).then((res) => {
         //  setDisabled(true)
         // console.log(res)
   
       }).catch(() => {
         console.log(id)
       })
       // console.log(id)
     }
    >     
       Livrée  
    </Button> 
    )
  }

}

 

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'date', headerName: 'Date', width: 160 },
  { field: 'idData', headerName: 'N° de commande', width: 180 },
  { field: 'email', headerName: 'Adresse-email', width: 200 },
  { field: 'client_id', headerName: 'Client ID (STRIPE)', width: 200 },
  { field: 'total', headerName: 'Total Payé', width: 100, renderCell: (params) => (
    <p>{params.getValue(params.id, 'total')} €</p>)
  },
  { field: 'status', headerName: 'Etat', width: 100 },
  { field: 'detail', headerName: 'Détails', width: 120, renderCell: (params) => (
    getDetailsOrder(params.getValue(params.id, 'idData'), params.getValue(params.id, 'client_id'),
      params.getValue(params.id, 'total'), params.getValue(params.id, 'status'),params.getValue(params.id, 'user_id'),
      adresse, phone, email,params.getValue(params.id, 'date'))),
  },

];

 // creer un tableau pour ajouter a dataOrders qui utilise getValue pour row
  const rows = dataOrders;

  console.log(dataOrders)


  const getDetailsOrder = (id, client,total, etat, idUser, adresse, phone, email, date) => {
    return(
      <Button
      // variant="solid"
      color="secondary"
      size="small"
      // style={{ marginLeft: 16 }}
      onClick={()=>
          
          history.push({
              pathname: "/admin/utilisateurs/commandes/details",
              state: { email: email,
                       phone:phone,
                       adresse:adresse,
                       client:client,
                       total:total,
                       etat:etat,
                       nom:nom,
                       prenom:prenom,
                       id:id,
                       idUser:idUser,
                       date:date
              }
          })
      }
    >     
     <VisibilityIcon/>  
    </Button> 
    )
}


  const getLoading = () => {
    return(
    <div style={{display: 'flex', padding:80, justifyContent: 'center'}}>
      <CircularProgress color="secondary"  />
    </div>
    )
  }
    return (
      <div style={{ height: 400, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
           Les commandes effectuées
        </Typography> 
        {
          loading ? 
          getLoading()
          :
          <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        
        />
        }
        
      </div>
    );
}

export default Orders;