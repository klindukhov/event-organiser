import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import acc from '../../images/accIcon.png';
import Sidebar from './Sidebar';
import '../../styles/general/Header.css';
import { useState } from 'react/cjs/react.development';
import apiFetch from '../../api';

const Header = (props) => {
  const [userPageLink, setUserPageLink] = useState('/SignIn');
  const [userName, setUserName] = useState('Sign in');
  const [myAccount, setMyAccount] = useState('/SignIn');
  const [accType, setAccType] = useState('');
  const [logoLink, setLogoLink] = useState('/');

  //  eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (userName === 'Sign in' && props.myProps.authorized) { props.myProps.setUnauth(); window.location.reload() } }, [])

  const [theme, setTheme] = useState('');
  useEffect(() => {
    let r = document.querySelector(':root');
    if (window.sessionStorage.getItem('theme') !== null) {
      setTheme(window.sessionStorage.getItem('theme'));
      if (window.sessionStorage.getItem('theme') === '\u263E') {
        r.style.setProperty('--bg', '#e5e5e5');
        r.style.setProperty('--txt', '#47525e');
        r.style.setProperty('--blockbg', 'white');
      } else if (window.sessionStorage.getItem('theme') === '\u263C') {
        r.style.setProperty('--bg', 'black');
        r.style.setProperty('--txt', 'white');
        r.style.setProperty('--blockbg', '#47525e');
      }
    } else {
      r.style.setProperty('--bg', '#e5e5e5');
      r.style.setProperty('--txt', '#47525e');
      r.style.setProperty('--blockbg', 'white');
      setTheme('\u263E');
    }
  }, [])

  const handleThemeChange = () => {
    let r = document.querySelector(':root');
    if (theme === '\u263C') {
      r.style.setProperty('--bg', '#e5e5e5');
      r.style.setProperty('--txt', '#47525e');
      r.style.setProperty('--blockbg', 'white');
      setTheme('\u263E');
      window.sessionStorage.setItem('theme', '\u263E');
    } else if (theme === '\u263E') {
      r.style.setProperty('--bg', 'black');
      r.style.setProperty('--txt', 'white');
      r.style.setProperty('--blockbg', '#47525e');
      setTheme('\u263C');
      window.sessionStorage.setItem('theme', '\u263C');
    }
  }


  useEffect(() => {
    if (props.myProps.authorized === true) {
      if (props.myProps.userData.type === 'C') {
        setUserPageLink('/CustomerProfilePage');
        setMyAccount('/CustomerProfilePage');
        setAccType('C');

        apiFetch(`customers?id=${props.myProps.userId}`)
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

        apiFetch(`business/${props.myProps.userId}/detail`)
          .then(res => {
            setUserName(res.firstName + ' ' + res.lastName);
            props.myProps.setUser(res);
          })
          .catch(error => { console.log('error', error); props.myProps.setUnauth(); });
      } else if (props.myProps.userData.type === 'A') {
        setAccType('A');
        setUserName('admin');
        setUserPageLink('/ProblemsPage');
        setMyAccount('/ProblemsPage');
        setLogoLink('/ProblemsPage');

        apiFetch(`problems?status=ALL`)
          .then(response => { if (response.status === 403) { props.myProps.setUnauth() } })
          .catch(error => { console.log('error', error); props.myProps.setUnauth() });

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
        <input type='button' className='theme-button' value={theme} onClick={handleThemeChange} />


      </header>
    </div>
  );
};

export default Header;