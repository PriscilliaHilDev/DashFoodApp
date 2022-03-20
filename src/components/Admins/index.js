import React, {useEffect, useContext, useState} from 'react';
import { DataGrid} from '@mui/x-data-grid';
import Add from './add';
import Grid from '@material-ui/core/Grid';
import { FirebaseContext } from '../../Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

 // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.getValue(params.id, 'Prénom') || ''} ${
  //       params.getValue(params.id, 'Nom') || ''
  //     }`,
  // },

const Admins = () => {

  const [readAdmins, setReadAdmins] = useState(null);
  const {queryUsersAdmins, queryUpAdminStatus} = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);

  const {user} = useSelector(state => state)
      
  const listAdmins = async() => {
 
    await queryUsersAdmins().onSnapshot((snapshot)=>{

    let allAdmins = [];
    snapshot && !snapshot.empty ? snapshot.forEach(element => {
      allAdmins = ([...allAdmins, {idData:element.id, ...element.data()}]);
        setLoading(false)
        
    }):
     
        setLoading(false)
        setReadAdmins(allAdmins)
        console.log('admins',allAdmins)

    })
}

console.log(user)

  useEffect(() => {

    const subscribeAdmins = listAdmins()
    return  (
      subscribeAdmins
    )
    
  }, [])


  // const updateData = (id, data) => {
    
  //     queryUpAdminStatus(id).update(
  //       data
  //      ).then((res) => {
  //       //  setDisabled(true)
  //       // console.log(res)
  
  //      }).catch(() => {
  //       console.log('merde')
  //       console.log(id)
  //      })
    
  // }

  const getActions = (status, id, superAdmin) => {
    if(status == 'actif' &&  superAdmin == false){
      return(
        <Button
            // variant="solid"
            color="secondary"
            size="small"
            // style={{ marginLeft: 16 }}
            onClick={()=>
              window.confirm("Etes vous sure de vouloir retirer les droits de cet Administrateur ? ") &&
              queryUpAdminStatus(id).update(
                {status: "inactif"}
              ).then((res) => {
                //  setDisabled(true)
                // console.log(res)
          
              }).catch(() => {
                console.log('merde')
                console.log(id)
              })
            }

          >     
           <CloseIcon/> 
          </Button> 
      )
    }
    if(status == 'inactif' &&  superAdmin == false){
      return(
        <Button
            // variant="solid"
            color="secondary"
            size="small"
            // style={{ marginLeft: 16 }}
            onClick={()=>
              window.confirm("Etes vous sure de vouloir reactiver les droits de cet Administrateur ? ") &&
              queryUpAdminStatus(id).update(
                {status: "actif"}
              ).then((res) => {
                //  setDisabled(true)
                // console.log(res)
          
              }).catch(() => {
                console.log('merde')
                console.log(id)
              })
              // console.log(id)
            }
          >     
           <CheckIcon/> 
          </Button> 
      )
    }

    if(superAdmin == true){
      return(
        <Button
            // variant="solid"
            color="secondary"
            size="small"
            // style={{ marginLeft: 16 }}
            disabled
          >     
           SUPER ADMIN
          </Button> 
      )
    }
     
  }

  const dataAdmin = readAdmins?.map((val, index) => {
    return({id:index+1,date:val.createdAt.toDate().toLocaleString('fr-FR'), action:getActions(val.status), ...val}) 
})


  

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'date', headerName: 'Inscription', width: 160 },
  { field: 'lastName', headerName: 'Nom', width: 160 },
  { field: 'firstName', headerName: 'Prénom', width: 160 },
  { field: 'email', headerName: 'Email', width: 230 },
  { field: 'status', headerName: 'Status', width: 160 },
  { field: 'action', headerName: 'Action', width: 155, renderCell: (params) => (
    getActions(params.getValue(params.id, 'status'),params.getValue(params.id, 'idData'), params.getValue(params.id, 'superAdmin'))),
  },
  { field: 'idData', headerName: 'identifiant', width: 10, hide:true },
  { field: 'superAdmin', headerName: 'SuperAdmin', width: 10, hide:true },
];

 // creer un tableau pour ajouter a dataAdmin qui utilise getValue pour row
  const rows = dataAdmin;

  console.log(dataAdmin, 'donneee')

//  console.log(dataAdmin)


 
  // const Edition = ({id}) => {
  //   return(
  //     <Edit id={id} />
  //   )
  // }

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
           Gestion des Administrateurs
        </Typography> 
        <Grid container  justifyContent="center" style={{paddingBottom:30}}>
          <Grid item>
            <Add list={readAdmins} />
          </Grid>
        </Grid>
        {
          loading ? 
          getLoading()
          :
          <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          // onCellClick={(params, event) => {
          //   console.log(params)
          //   event.defaultMuiPrevented = true;
          // }}
        />
        }
        
      </div>
    );
}

export default Admins;