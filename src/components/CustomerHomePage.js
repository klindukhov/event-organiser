import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CustomerHomePage.css'


export default function CustomerHomePage(){
return(
<div className='customer-home-main'>
    <div className='customer-home-rect'>
    <h1>Customer Home <Link to='/CustomerProfilePage'>Settings</Link></h1>

    </div>
    <div className='customer-home-rect'>

    </div>

</div>)
}