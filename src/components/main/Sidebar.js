import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/Sidebar.css';

export default function Sidebar(props) {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/signIn">
        My account
      </a>
      <a className="menu-item" href="/VenuesPage">
        Venues
      </a>
      <a className="menu-item" href="/CustomerProfilePage">
        Customer Profile settings
      </a>
      <a className="menu-item" href="/BusinessProfilePage">
        Business Profile settings
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