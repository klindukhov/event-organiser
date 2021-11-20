import React from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/Header.css';

const Header = () => {
return (
  <div className="mainH">
    <header>
      <Sidebar/>
          <Link to='/' className="logo">
            <h2 className="logo">
              *LOGO*
            </h2>
          </Link>
          <div className="cap-margin"></div>
          <Link to='/SignIn'>
            <img src={acc} className="accountIcon" alt="accountIcon"/>
          </Link>
    </header>
  </div>
    );
};

export default Header;