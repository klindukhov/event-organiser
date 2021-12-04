import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/Header.css';
import { useState } from 'react/cjs/react.development';

const Header = (props) => {
  const [userPageLink, setUserPageLink] = useState('/SignIn');
  const [userName, setUserName] = useState('Sign in');

  useEffect(() => {
    if (props.myProps.authorized === true) {
      setUserPageLink('/CustomerProfilePage');

      var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        credentials: 'include'
      };

      fetch(`http://localhost:8080/api/customers?id=${props.myProps.userId}`, requestOptions)
        .then(response => response.json())
        .then(res => setUserName(res.firstName + ' ' + res.lastName))
        .catch(error => console.log('error', error));
    } else {
      setUserPageLink('/SignIn');
      setUserName('Sign in');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.myProps.authorized]);


  return (
    <div className="header-main">
      <header className='header'>
        <Sidebar props={props.myProps} />
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
            <p className='user-logo-text'>{userName}</p>
          </Link>
        </div>

      </header>
    </div>
  );
};

export default Header;