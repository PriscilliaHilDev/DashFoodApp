import React, {useContext} from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { fontStyle } from '@mui/system';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const images = [
  {
    src: 'https://cdn.pixabay.com/photo/2017/03/23/19/57/asparagus-2169305_1280.jpg',
    title: 'Vos Produits',
    width: '28%',
    url:'/admin/produits'
  },
  {
    src:'https://cdn.pixabay.com/photo/2017/07/28/14/29/macarons-2548827_1280.jpg',
    title: 'Vos Catégories',
    width: '28%',
    url:'/admin/categories'
  },
  // {
  //   src:'https://cdn.pixabay.com/photo/2015/02/02/11/08/office-620817_1280.jpg',
  //   title: 'Les admins',
  //   width: '45%',
  //   url:'/admin/administrateurs'
  // },
  {
    src:'https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_1280.jpg',
    title: 'Les utlisateurs',
    width: '28%',
    url:'/admin/utilisateurs'
  },
];




const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('mg')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  borderRadius:20
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
  color:'red'
}));


const useStyles = makeStyles((theme) => ({  
  cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      
    },

}));
 
const HomeAdmin = () => {

 const classes = useStyles()
 const history = useHistory()
  
  return (
    <Container className={classes.cardGrid} maxWidth="md">
    <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
      Bienvenu sur l'Admin de MyFastFood
    </Typography> 
    <Typography component="h3" style={{marginBottom:30}} variant="h5" align="center" color="textPrimary" gutterBottom>
      Ici vous pouvez gerer 
    </Typography> 

    <Grid  sx={{ display: 'flex', flexDirection:'row', width: '100%', alignItems:"center" }} >
    {/* <Grid > */}
    {images.map((image) => (
     <ImageButton
     
        focusRipple
        key={image.title}
        style={{
          width: image.width,
          margin:5,
          marginLeft:35,
          
        }}
        onClick={()=>history.push(image.url)}   
            
      >
       
        <ImageSrc style={{ backgroundImage: `url(${image.src})` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
              fontSize:28,
              textTransform:"uppercase",
              
            }}
          >
            {image.title}
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      
    ))}
  </Grid>
  </Container>
  )
}

export default HomeAdmin;