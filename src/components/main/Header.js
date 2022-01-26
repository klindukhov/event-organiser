import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Sidebar from './Sidebar';
import '../../styles/general/Header.css';
import { useState } from 'react/cjs/react.development';
import apiFetch from '../../api';
import Logo from '../../images/Logo.png'
import { Avatar, Tooltip } from '@mui/material'

const Header = (props) => {
  const history = useHistory();
  const [userPageLink, setUserPageLink] = useState('/SignIn');
  const [userName, setUserName] = useState('Sign in');
  const [myAccount, setMyAccount] = useState('/SignIn');
  const [accType, setAccType] = useState('');
  const [logoLink, setLogoLink] = useState('/');
  const [avatar, setAvatar] = useState('');

  const [theme, setTheme] = useState('');
  useEffect(() => {
    let r = document.querySelector(':root');
    if (window.sessionStorage.getItem('theme') !== null) {
      setTheme(window.sessionStorage.getItem('theme'));
      if (window.sessionStorage.getItem('theme') === '\u263E') {
        r.style.setProperty('--bg', '#F2F4F5');
        r.style.setProperty('--txt', '#47525e');
        r.style.setProperty('--blockbg', 'white');
      } else if (window.sessionStorage.getItem('theme') === '\u263C') {
        r.style.setProperty('--bg', 'black');
        r.style.setProperty('--txt', 'white');
        r.style.setProperty('--blockbg', '#47525e');
      }
    } else {
      r.style.setProperty('--bg', '#F2F4F5');
      r.style.setProperty('--txt', '#47525e');
      r.style.setProperty('--blockbg', 'white');
      setTheme('\u263E');
    }
  }, [])

  const handleThemeChange = () => {
    let r = document.querySelector(':root');
    if (theme === '\u263C') {
      r.style.setProperty('--bg', '#F2F4F5');
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
      if (props.myProps.userData.user && props.myProps.userData.user.type === 'C') {
        setUserPageLink('/CustomerProfilePage');
        setMyAccount('/CustomerProfilePage');
        setAccType('C');

        apiFetch(`customers?id=${props.myProps.userData.id}`)
          .then(res => {
            setUserName(res.firstName + ' ' + res.lastName);
            if (res.avatar !== null) {
              setAvatar('data:image/png;base64,' + res.avatar.encodedImage);
            }
          }).catch(error => { console.log('error', error); props.myProps.setUnauth(); });
      } else if (props.myProps.userData.user && props.myProps.userData.user.type === 'B') {
        setAccType('B');
        setUserPageLink('/BusinessProfilePage');
        setMyAccount('/BusinessProfilePage');
        setLogoLink('/ReservationRequestsPage');

        apiFetch(`business/${props.myProps.userData.id}/detail`)
          .then(res => {
            setUserName(res.firstName + ' ' + res.lastName);
          })
          .catch(error => { console.log('error', error); props.myProps.setUnauth(); });
      } else if (props.myProps.userData.type === 'A') {
        setAccType('A');
        setUserName('admin');
        setUserPageLink('/ProblemsPage');
        setMyAccount('/ProblemsPage');
        setLogoLink('/ProblemsPage');

        apiFetch(`problems?status=ALL`)
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
        <Sidebar props={props.myProps} myAccount={myAccount} avatar={avatar} changeTheme={handleThemeChange} userName={userName} accType={accType} />
        <div className="logo">
          <img alt='logo' src={Logo} className='header-logo' onClick={() => history.push(logoLink)} />
        </div>
        <div className="cap-margin">
          {props.myProps.headerMessage}
        </div>
        <div className='user-logo-div'>
          <Link to={userPageLink} className='user-logo-div'>
            <Tooltip placement='right-start' title={userName === 'Sign in' ? 'sign in' : 'settings'}>
              <Avatar alt={userName} sx={{ width: '60px', height: '60px', marginTop: '10px' }} src={avatar} />
            </Tooltip>
            <p className='user-logo-text'>{userName}</p>
          </Link>

        </div>
      </header>
    </div>
  );
};

export default Header;