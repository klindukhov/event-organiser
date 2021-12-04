import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/Header.css';
import { useState } from 'react/cjs/react.development';

const Header = (props) => {
  const [userPageLink, setUserPageLink] = useState('/SignIn');
  useEffect(() => {
    if (props.myProps.authorized === true) {
      setUserPageLink('/CustomerProfilePage');
      console.log(props.myProps.authorized)
    }else{
      setUserPageLink('/SignIn');
      console.log('i dont like debugger' + props.myProps.authorized)
    }
  },[props.myProps.authorized]);

  const getUserName = () => {
    if (props.myProps.authorized === true) {
      return 'userName';
    } else {
      return 'Sign in';
    }
  }

  return (
    <div className="header-main">
      <header className='header'>
        <Sidebar props={props.myProps}/>
        <Link to='/' className="logo">
          <p className="logo">
            *LOGO*
          </p>
        </Link>
        <div className="cap-margin">
          {props.myProps.headerMessage}
        </div>
        <div className='user-logo-div'>
          <Link to={userPageLink} className='user-logo-div'>
            <img src={acc} className="accountIcon" alt="accountIcon" />
            <p className='user-logo-text'>{getUserName()}</p>
          </Link>
        </div>

      </header>
    </div>
  );
};

export default Header;