import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/main/App';
import Header from './components/main/Header';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Header />
    <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
