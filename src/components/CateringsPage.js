import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import '../styles/CateringsPage.css'

export default function CateringsPage(props) {
    const [caterings, setCaterings] = useState([]);
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Caterings') }, []);
    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/caterings/allowed/all", requestOptions)
            .then(response => response.json())
            .then(result => setCaterings(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddToEvent = (c) =>{
        props.setCatering(c)
        history.push('/newEventPage');
    }
    return (
        <div className='caterings-page-main'>
            {caterings.map(c => <div key={c.name} className='restaurant-list-element'>
                <div className='restaurant-listing' >
                    <div className='overlay-listing' >
                        <div className='overlay-listing-left'>
                            {c.name}<br />
                            {c.description}
                        </div>
                        <div className='overlay-listing-right'>
                            Service cost: {c.serviceCost} pln<br/>
                            <input type='button' value='Add to event' className='add-to-event-button' onClick={() => handleAddToEvent(c)}/>
                        </div>
                    </div>
                    <div className='rest-listing-pics'>
                    </div>
                </div>
            </div>)}
        </div>)
}