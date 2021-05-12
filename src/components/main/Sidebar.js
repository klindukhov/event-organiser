import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/signIn">
        My account
      </a>

      
    </Menu>
  );
};