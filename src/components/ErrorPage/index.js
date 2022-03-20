import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ErrorImage from "../../assets/images/errorPage.jpg"
import { Link } from 'react-router-dom';



const styles = {
  paperContainer: {
     
  }
};

const index = () => {
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '70vh',

    }}
  >
    <CssBaseline />
    <Container  sx={{ mt: 1, mb: 2,height:370,width:800,backgroundImage: `url(${ErrorImage})`, backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
    }} 
style={styles.paperContainer} maxWidth="lg">
      
    </Container>
    <Container  sx={{ mt: 1, mb: 0 }} maxWidth="sm">
      <Typography variant="h5" component="h2" style={{textAlign:"center"}}>
        <Link to='/'>Revenir à la page d'Accueil</Link>
      </Typography>
    </Container>
   
  </Box>
  )
}

export default index;