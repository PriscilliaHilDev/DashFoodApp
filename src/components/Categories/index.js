import React, { Fragment, useRef  } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { fontStyle } from '@mui/system';
import Sucres from './sucres';
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
// import Grid from '@material-ui/core/Grid';




const images = [
  {
    // url: 'https://cdn.pixabay.com/photo/2018/06/12/12/43/muffins-3470531_1280.jpg',
    url: 'https://cdn.pixabay.com/photo/2017/01/16/17/45/pancake-1984716_1280.jpg',
    title: 'Sucrées',
    width: '45%',
  },
  {
    // url: 'https://cdn.pixabay.com/photo/2016/09/15/19/24/salad-1672505_1280.jpg',
    url:'https://cdn.pixabay.com/photo/2016/12/17/18/51/spices-1914130_1280.jpg',
    title: 'Salées',
    width: '45%',
  },
];


const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
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
 
const Categories = () => {
  const form = useRef();

  const classes = useStyles();

  const history = useHistory();

  const toggleCategory = (name) => {
    if(name === "Sucrées"){
      history.push("/admin/categories/sucrees")
    }else{
      history.push("/admin/categories/salees")
    }
  }

  // var templateParams = {
  //   to_name: 'priscillia_hillion@outlook.fr',
  //   from_name: 'moi meme the boss girl',
  //   message_html: 'Please Find out the attached file'
  // };
  // init("user_fnZE6Y6JbzAdYWDLIGi5w");



  // const sendEmail = (e) => {
  //   e.preventDefault();

  //   emailjs.send('service_dgpy2rs', 'template_rtlyagn', templateParams)
  //     .then((result) => {
  //         console.log(result.text);
  //     }, (error) => {
  //         console.log(error.text);
  //     });
  // };

  return (
    <Container className={classes.cardGrid} maxWidth="md">
    <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
      Les Categories
    </Typography> 

    <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: 300, width: '100%', marginTop:10, alignItems:"center" }}>
    {images.map((image) => (
     <ImageButton
        focusRipple
        key={image.title}
        style={{
          width: image.width,
        }}
        onClick={()=>toggleCategory(image.title)}        
      >
       
        <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
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
              fontSize:30,
              textTransform:"uppercase"
            }}
          >
            {image.title}
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      
    ))}
  </Box>
  </Container>
  )
}

export default Categories
