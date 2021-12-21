import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/general/Header.css';
import { useState } from 'react/cjs/react.development';

const Header = (props) => {
  const [userPageLink, setUserPageLink] = useState('/SignIn');
  const [userName, setUserName] = useState('Sign in');
  const [myAccount, setMyAccount] = useState('/SignIn');
  const [accType, setAccType] = useState('');
  const [logoLink, setLogoLink] = useState('/');


  useEffect(() => {
    if (props.myProps.authorized === true) {
      if (props.myProps.userData.type === 'C') {
        setUserPageLink('/CustomerProfilePage');
        setMyAccount('/CustomerProfilePage');
        setAccType('C');


        var myHeaders = new Headers();

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
          credentials: 'include'
        };

        fetch(`http://localhost:8080/api/customers?id=${props.myProps.userId}`, requestOptions)
          .then(response => response.json())
          .then(res => {
            if (res.firstName !== undefined) {
              setUserName(res.firstName + ' ' + res.lastName);
              props.myProps.setUser(res);
            } else {
              props.myProps.setUnauth();
            }
          }).catch(error => console.log('error', error));
      } else if (props.myProps.userData.type === 'B') {
        setAccType('B');
        setUserPageLink('/BusinessProfilePage');
        setMyAccount('/BusinessProfilePage');
        setLogoLink('/BusinessHomePage');

        var myHeaderss = new Headers();

        var requestOptionss = {
          method: 'GET',
          headers: myHeaderss,
          redirect: 'follow',
          credentials: 'include'
        };

        fetch(`http://localhost:8080/api/business/${props.myProps.userId}/detail`, requestOptionss)
          .then(response => response.json())
          .then(res => {
            if (res.firstName !== undefined) {
              setUserName(res.firstName + ' ' + res.lastName);
              props.myProps.setUser(res);
            } else {
              props.myProps.setUnauth();
            }
          }).catch(error => console.log('error', error));
      } else if (props.myProps.userData.type === 'A') {
        setAccType('A');
        setUserName('admin');
        setUserPageLink('/ProblemsPage');
        setMyAccount('/ProblemsPage');
        setLogoLink('/ProblemsPage');

      }

    } else if (props.myProps.authorized === false) {
      setUserPageLink('/SignIn');
      setUserName('Sign in');
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.myProps.authorized]);


  return (
    <div className="header-main">
      <header className='header'>
        <Sidebar props={props.myProps} myAccount={myAccount} userName={userName} accType={accType} />
        <Link to={logoLink} className="logo">
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