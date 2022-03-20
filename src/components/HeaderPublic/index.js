import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const HeaderPublic = () => {

  const classes = useStyles();
  const location = useLocation()


  return (

    <div className={classes.root}>
    <AppBar position="static" style={{background:'#ED970B'}}>
      <Toolbar>
        <Link style={{color:'whitesmoke', textDecoration:'none'}} to='/'> 
          <Typography variant="h6" className={classes.title}>
            MyFastFood Admin
          </Typography>
      </Link>
      </Toolbar>
    </AppBar>
  </div>
  

    // location.pathname === '/connexion' && location.pathname !== '/inscription' ?
    // <div className={classes.root}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <Typography variant="h6" className={classes.title}>
    //         MyFastFood Admin
    //       </Typography>
    //       <Link  className='link' to='/inscription'> 
    //           <Button variant="contained" size="large" color="inherit">
    //             S'inscrire
    //           </Button> 
    //       </Link>         
    //     </Toolbar>
    //   </AppBar>
    // </div>
    // :
    // <div className={classes.root}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <Typography variant="h6" className={classes.title}>
    //         MyFastFood Admin
    //       </Typography>
    //         <Link className='link' to='/connexion'> 
    //           <Button variant="contained" size="large" color="inherit">
    //             S'Authentifier 
    //           </Button> 
    //       </Link> 
    //     </Toolbar>
    //   </AppBar>
    // </div>
  )
}

export default HeaderPublic;