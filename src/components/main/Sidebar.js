import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/Sidebar.css';

import accIcon from '../../images/accIcon250.png'
import { useEffect, useState } from 'react/cjs/react.development';

export default function Sidebar(props) {
  const [logout, setLogout] = useState('');

  useEffect(() => {
    if(props.userName !== 'Sign in'){
      setLogout(<a className="menu-item" href="/" onClick={() => { console.log(props.props.setUnauth()) }}>Logout</a>)
    }else{
      setLogout('');
    }
  }, [props])


  return (
    <Menu>
      <div className='sidebar-user-card' style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
        <img alt='acc-icon' src={accIcon} className='acc-icon' style={{ height: '70px', width: '70px' }} />
        <div className='sidebar-user-info' style={{ justifySelf: 'start' }}>
          <a className="menu-item" href={props.myAccount} style={{textDecoration: 'none'}}>{props.userName}</a><br/>
          {logout}
        </div>
      </div>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/NewEventPage">
        My events
      </a>
      <a className="menu-item" href="/NewEventPage">
        New event
      </a>
      <a className="menu-item" href="/ContactFormPage">
        Report a problem
      </a>
    </Menu>
  );
};