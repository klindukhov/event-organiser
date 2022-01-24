import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './styles/general/index.css';
import App from './components/main/App';
import Header from './components/main/Header';
import Footer from './components/main/Footer';
import apiFetch from './api.js'
import Popup from './components/main/Popup';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';




const Main = () => {
  const [headerMessage, setHeaderMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState();

  const theme = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#47525e',
        darker: '#053e85',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    },
  });

  useEffect(() => {
    if (window.localStorage.getItem('auth') === 'true') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setUserId(window.localStorage.getItem('userId'));
    setUserData(JSON.parse(window.localStorage.getItem('userData')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const setAuth = (resBody) => {
    setUserData(resBody);
    setUserId(resBody.id);
    setAuthorized(true);
    window.localStorage.setItem('auth', true);
    window.localStorage.setItem('userId', resBody.id);
    window.localStorage.setItem('userData', JSON.stringify(resBody));
  }

  const setUnauth = () => {
    setAuthorized(false);
    window.localStorage.setItem('auth', false);
    window.localStorage.clear();

    apiFetch('logout', 'GET').catch(error => console.log('error', error));

    window.location.href = '/';
  }

  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState();

  const togglePopup = (content) => {
    setIsOpen(!isOpen);
    setPopupContent(content);
  }

  const myProps = {
    authorized: authorized,
    userId: userId,
    userData: userData,
    setAuth: setAuth,
    setUnauth: setUnauth,
    setHeaderMessage: setHeaderMessage,
    headerMessage: headerMessage,
    togglePopup: togglePopup
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header myProps={myProps} />
        <App myProps={myProps} />
        {isOpen &&
          <Popup
            content={popupContent}
            handleClose={togglePopup}
          />
        }
        <Footer myProps={myProps} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);
