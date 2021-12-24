import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/general/Sidebar.css';

import accIcon from '../../images/accIcon250.png'
import { useEffect, useState } from 'react/cjs/react.development';

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
        <img alt='acc-icon' src={accIcon} className='acc-icon' style={{ height: '70px', width: '70px' }} />
        <div className='sidebar-user-info' style={{ justifySelf: 'start' }}>
          <a className="menu-item" href={props.myAccount} style={{ textDecoration: 'none' }}>{props.userName}</a><br />
          {logout}
        </div>
      </div>
      {props.accType === 'C' &&
        <a className="menu-item" href="/">
          Home
        </a>
      }
      {props.accType === 'C' &&
        <a className="menu-item" href="/NewEventPage">
          New event
        </a>
      }
      {props.accType === 'C' &&
        <a className="menu-item" href="/NewEventPage">
          My events
        </a>
      }
      {props.accType === 'C' &&
        <a className="menu-item" href="/GuestBookPage">
          Guest book
        </a>
      }
      {props.accType === 'C' &&
        <a className="menu-item" href="/ContactFormPage">
          Report a problem
        </a>
      }
      {props.accType === 'B' &&
        <a className="menu-item" href="/ReservationRequestsPage">
          Reservation requests
        </a>
      }
      {props.accType === 'B' &&
        <a className="menu-item" href="/CateringsPage">
          My caterings
        </a>
      }
      {props.accType === 'B' &&
        <a className="menu-item" href="/VenuesPage">
          My locations
        </a>
      }
      {props.accType === 'B' &&
        <a className="menu-item" href="/ServicesPage">
          My services
        </a>
      }
      {props.accType === 'B' &&
        <a className="menu-item" href="/ContactFormPage">
          Report a problem
        </a>
      }
      {props.accType === 'A' &&
        <a className="menu-item" href="/ProblemsPage">
          Problems
        </a>
      }
      {props.accType === 'A' &&
        <a className="menu-item" href="/UsersPage">
          Users
        </a>
      }
      {props.accType === 'A' &&
        <a className="menu-item" href="/VerificationRequestsPage">
          Verification requests
        </a>
      }

    </Menu>
  );
};