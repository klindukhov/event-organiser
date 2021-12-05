import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/Sidebar.css';

export default function Sidebar(props) {

  return (
    <Menu>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href={props.myAccount}>
        My account
      </a>
      <a className="menu-item" href="/ContactFormPage">
        Report a problem
      </a>
      <a className="menu-item" href="/NewEventPage">
        New event
      </a>
      <a className="menu-item" href="/RestaurantPage">
        RestaurantDemo
      </a>
      <a className="menu-item" href="/" onClick={() => {console.log(props.props.setUnauth())}}>
        Logout
      </a>
    </Menu>
  );
};