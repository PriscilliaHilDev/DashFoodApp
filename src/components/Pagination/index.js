import React, {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Paginate = ({getPage, nbPages}) => {
    const classes = useStyles();
    return (

        nbPages > 1 ?
        <div className={classes.root} style={{display: 'flex', justifyContent: 'center', padding:20}}>
            <Pagination count={nbPages} onChange={getPage}  color="primary" />
        </div>
        :
        <div></div>
       
    )
}

export default Paginate
