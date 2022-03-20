import React, {useEffect, useContext, useState} from 'react';
import { DataGrid} from '@mui/x-data-grid';
import Grid from '@material-ui/core/Grid';
import { FirebaseContext } from '../../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Orders from './orders';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from "react-router-dom";
import { Box, withStyles } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';



const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const useStyles = makeStyles({
  root: {
  "& .styledrows": {
  backgroundColor: "green",
  maxHeight: "none !important",
  },
  "& .MuiDataGrid-cell": {
    lineHeight: "unset !important",
    maxHeight: "none !important",
    whiteSpace: "normal"
  },
  }
  });

const Customers = () => {

  const history = useHistory()

  const [readCustomers, setReadCustomers] = useState(null);
  const {queryCustomers, queryOrders} = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);

  const {user} = useSelector(state => state)
      
  const listCustomers = async() => {
 
    await queryCustomers().onSnapshot((snapshot)=>{

     let allCustomers = [];
     let i = 0;
      if(snapshot && !snapshot.empty){
        snapshot.forEach(element => {
          allCustomers = ([...allCustomers, {idData:element.id, ...element.data()}]);  
          i++;
        })

       if(i == allCustomers.length){
         setReadCustomers(allCustomers)
         setLoading(false)
       }

      }else{ 
        setLoading(false)
      }
    
    })
}



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



  useEffect(() => {


    const subscribeCustomers = listCustomers()
    return  (
      subscribeCustomers
    )
    
  }, [])



  const getRoles = (roles) => {
      if(roles){
        if(roles.includes('ROLE_ADMIN')){
          return('Admin')
        }
        if(roles.includes('ROLE_CLIENT')){
          return('Client')
        }
      }
     
  }

   const getOrders = (id) => {
       return(
           <Orders id={id} />
       )
   }

  const dataCustomers = readCustomers?.map((val, index) => {
    return({id:index+1,date:timeConverter(val.createdAt), ...val}) 
})


  const goDetail = (id, email, adresse, phone, nom, prenom) => {
      return(
        <Button
        // variant="solid"
        color="secondary"
        size="small"
        // style={{ marginLeft: 16 }}
        onClick={()=>
            
            history.push({
                pathname: `/admin/utilisateurs/${id}`,
                state: { email: email,
                         phone:phone,
                         adresse:adresse,
                         nom:nom,
                         prenom:prenom
                }
            })
        }
      >     
       <VisibilityIcon/>  
      </Button> 
      )
  }

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'date', headerName: 'Inscription', width: 170 },
  { field: 'prenom', headerName: 'Prénom', width: 150 },
  { field: 'adresse', headerName: 'Adresse', width: 300, renderCell: (params) => (
    getDataInfos(params.getValue(params.id, 'adresse'))),
  },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Téléphone', width: 160 , renderCell: (params) => (
    getDataInfos(params.getValue(params.id, 'phone'))),
  },
  // { field: 'adresse', headerName: 'Adresse de Livraison', width: 220, renderCell: (params) => (
    
  //   <HtmlTooltip
  //   title={
  //       <Typography color="inherit">{params.getValue(params.id, 'adresse')}</Typography>
  //   }
  // >
  //   <Button>{params.getValue(params.id, 'adresse')}</Button>
  // </HtmlTooltip>
  // )},
  { field: 'roles', headerName: 'Roles', width: 100, renderCell: (params) => (
    getRoles(params.getValue(params.id, 'roles'))),
  },
  { field: 'orders', headerName: 'Détails', width: 100, renderCell: (params) => (
    goDetail(params.getValue(params.id, 'idData'), params.getValue(params.id, 'email'), params.getValue(params.id, 'adresse'), params.getValue(params.id, 'phone'),  params.getValue(params.id, 'nom'), params.getValue(params.id, 'prenom'))),
  },
  { field: 'idData', headerName: 'identifiant', width: 10, hide:true },


];

  const getDataInfos  = (data) => {
    if(data == null){
      return 'non renseigné'
    }else{
      return data
    }
  }

 // creer un tableau pour ajouter a dataCustomers qui utilise getValue pour row
  const rows = dataCustomers;



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
           Les utlisateurs de MyFastFood
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
          getRowClassName={(params) => `styledrows`}
          getCellClassName={(params) => `MuiDataGrid-cel`}
           
          // checkboxSelection
          // onCellClick={(params, event) => {
          //   event.defaultMuiPrevented = true;
          // }}
        />
        }
        
      </div>
    );
}

export default Customers;