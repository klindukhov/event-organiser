import { Link } from 'react-router-dom';
import React from 'react';
import '../../styles/business/BusinessHomePage.css'
import { useEffect } from 'react';

export default function BusinessHomePage(props){
    // eslint-disable-next-line
    useEffect(() => {props.setHeaderMessage('Business Dashboard')}, [])

    return(<div className='business-home-main'>
    <h1><Link to='/BusinessProfilePage'>Settings</Link> </h1>
    </div>
    )
}