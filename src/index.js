import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Firebase, {FirebaseContext} from "./Firebase"; 
// import 'bootstrap/dist/js/bootstrap.bundle';
// import 'semantic-ui-css/semantic.min.css';
import {Provider} from 'react-redux';
import store from "./Redux/store"



ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <Provider store={store}>
       <App/>
      </Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  
  document.getElementById('root')
  
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
