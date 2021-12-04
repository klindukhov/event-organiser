import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/main/App';
import Header from './components/main/Header';


const Main = () => {
  const [headerMessage, setHeaderMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('auth')) {
      setAuthorized(window.localStorage.getItem('auth'));
    } else {
      setAuthorized(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const setAuth = () => {
    setAuthorized(true);
    window.localStorage.setItem('auth', true);
  }

  const setUnauth = () => {
    setAuthorized(false);
    window.localStorage.setItem('auth', false);
    window.localStorage.clear();

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: 'include'
    };

    fetch("http://localhost:8080/api/logout", requestOptions)
      .then(response => response.text())
      .catch(error => console.log('error', error));
  }

  const myProps = {
    authorized: authorized,
    setAuth: setAuth,
    setUnauth: setUnauth,
    setHeaderMessage: setHeaderMessage,
    headerMessage: headerMessage
  }

  return (
    <BrowserRouter>
      <Header myProps={myProps} />
      <App myProps={myProps} />
    </BrowserRouter>
  );
}



ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);
