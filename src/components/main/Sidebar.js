import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/general/Sidebar.css';
import { useEffect, useState } from 'react/cjs/react.development';
import { Avatar } from '@mui/material';
import addEvent from '../../images/add event.png';
import guestBook from '../../images/guest book.png';
import home from '../../images/home.png';
import Event from '../../images/event.png';
import problem from '../../images/problem.png';
import request from '../../images/request.png';
import services from '../../images/services.png';
import venue from '../../images/venue.png';
import {Restaurant} from "@mui/icons-material";



export default function Sidebar(props) {
  const [logout, setLogout] = useState('');

  useEffect(() => {
    if (props.userName !== 'Sign in') {
      setLogout(<a className="menu-item" href="/" onClick={() => { props.props.setUnauth() }}>Logout</a>)
    } else {
      setLogout('');
    }
  }, [props])


  return (
    <Menu>
      <div className='sidebar-user-card' style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
        <a className="menu-item" href={props.myAccount} style={{ textDecoration: 'none' }}>
          <Avatar alt={props.userName} src={props.avatar} className='acc-icon' style={{ height: '70px', width: '70px' }} />
        </a>
        <div className='sidebar-user-info' style={{ justifySelf: 'start' }}>
          <a className="menu-item" href={props.myAccount} style={{ textDecoration: 'none' }}>{props.userName}</a><br />
          {logout}
        </div>
      </div>
      {props.accType === 'C' &&
        <a className="menu-item" href="/">
          <img alt='' src={home} style={{height: '16px'}}></img> Home
        </a>
      }
      {props.accType === 'C' &&
        <a className="menu-item" href="/EventDetailsPage/new" onClick={() => {
          window.localStorage.removeItem('locationDetails');
          window.localStorage.removeItem('eStart');
          window.localStorage.removeItem('eEnd');
          window.sessionStorage.setItem('filters', JSON.stringify({ "guestNum": '', "date": '', "eventType": '' }));
          window.localStorage.removeItem('eventName');
        }
        }>
          <img alt='' src={addEvent} style={{height: '16px'}}></img> New event
        </a>
      }
      {
        props.accType === 'C' &&
        <a className="menu-item" href="/ListPage/Events">
          <img alt='' src={Event} style={{height: '16px'}}></img> My events
        </a>
      }
      {
        props.accType === 'C' &&
        <a className="menu-item" href="/GuestBookPage">
          <img alt='' src={guestBook} style={{height: '16px'}}></img> Guest book
        </a>
      }
      {
        props.accType === 'B' &&
        <a className="menu-item" href="/ReservationRequestsPage">
          <img alt='' src={request} style={{height: '16px'}}></img> Requests
        </a>
      }
      {
        props.accType === 'B' &&
        <a className="menu-item" href="/ListPage/Caterings">
          <Restaurant style={{width: '16px'}} /> My caterings
        </a>
      }
      {
        props.accType === 'B' &&
        <a className="menu-item" href="/ListPage/Venues">
          <img alt='' src={venue} style={{height: '16px'}}></img> My locations
        </a>
      }
      {
        props.accType === 'B' &&
        <a className="menu-item" href="/ListPage/Services">
          <img alt='' src={services} style={{height: '16px'}}></img> My services
        </a>
      }
      {
        (props.accType === 'B' || props.accType === 'C') &&
        <a className="menu-item" href="/ContactFormPage">
          <img alt='' src={problem} style={{height: '16px'}}></img> Report a problem
        </a>
      }
      {
        props.accType === 'A' &&
        <a className="menu-item" href="/ProblemsPage">
          Problems
        </a>
      }
      {
        props.accType === 'A' &&
        <a className="menu-item" href="/UsersPage">
          Users
        </a>
      }
      {
        props.accType === 'A' &&
        <a className="menu-item" href="/VerificationRequestsPage">
          Verification requests
        </a>
      }

    </Menu >
  );
};