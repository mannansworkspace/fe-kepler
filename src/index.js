import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Map from './Map';
// import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter>
        {/* <Auth0Provider
          domain="dev-a3pepu3no3rjkle6.us.auth0.com"
          clientId="0jp6PbO91AHoEdEyNERtQhA8h16SxLs6"
          authorizationParams={{
            redirect_uri: 'http://localhost:3005/map'
          }}
        > */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="map" element={<Map />} />

        </Routes>
        {/* </Auth0Provider> */}

      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
