import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => {
    return (
      <div style={{display: 'flex', padding:80, top:100, justifyContent: 'center', height:500}}>
         <CircularProgress color="secondary"  />
      </div>
    )
}

export default Loader
