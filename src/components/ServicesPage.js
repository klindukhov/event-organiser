import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import '../styles/ServicesPage.css'

export default function ServicesPage(props) {
    const [services, setServices] = useState([]);
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Services') }, []);
    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/services/allowed/all", requestOptions)
            .then(response => response.json())
            .then(result => setServices(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddToEvent = (c) => {
        props.setService(c)
        history.push('/newEventPage');
    }
    return (
        <div className='caterings-page-main'>
            {services.map(c => <div key={c.id} className='restaurant-list-element'>
                <div className='restaurant-listing' >
                    <div className='overlay-listing' >
                        <div className='overlay-listing-left'>
                            {c.type}<br />
                            {c.descriprion}
                        </div>
                        <div className='overlay-listing-right'>
                            Service cost: {c.serviceCost} pln<br />
                            <input type='button' value='Add to event' className='add-to-event-button' onClick={() => handleAddToEvent(c)} />
                        </div>
                    </div>
                    <div className='rest-listing-pics'>
                    </div>
                </div>
            </div>)}
        </div>)
}