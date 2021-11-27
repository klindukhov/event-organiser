import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/main/App';
import Header from './components/main/Header';


const Main = () => {
  const [headerMessage, setHeaderMessage] = useState('');

  const myProps = {
    setHeaderMessage : setHeaderMessage,
    headerMessage: headerMessage
  }

  return (
    <BrowserRouter>
      <Header myProps={ myProps} />
      <App myProps={ myProps} />
    </BrowserRouter>
  );
}



ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);
