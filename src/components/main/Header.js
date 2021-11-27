import React from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/Header.css';

const Header = (props) => {
  return (
    <div className="header-main">
      <header className='header'>
        <Sidebar />
        <Link to='/' className="logo">
          <p className="logo">
            *LOGO*
          </p>
        </Link>
        <div className="cap-margin">
          {props.myProps.headerMessage}
          </div>
        <div className='user-logo-div'>
          <Link to='/SignIn' className='user-logo-div'>
            <img src={acc} className="accountIcon" alt="accountIcon" />
            <p className='user-logo-text'>Sign in</p>
          </Link>
        </div>

      </header>
    </div>
  );
};

export default Header;