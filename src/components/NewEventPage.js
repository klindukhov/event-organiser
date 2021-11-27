import React from 'react'
import '../styles/NewEventPage.css';
import { useEffect } from 'react';

export default function NewEventPage(props) {
    useEffect(() => { props.setHeaderMessage('New event') });
    return (
        <div className='new-event-main'>
            <div className='venue-choice-rect'>
                <p className='venue-choice-heading'>Venues</p>
                <input type='button' value='+' className='add-button' />

            </div>
            <div className='guest-choice-rect'>
                <p className='guest-choice-heading'>Guests</p>
                <input type='button' value='+' className='add-button' />

            </div>
        </div>
    )
}