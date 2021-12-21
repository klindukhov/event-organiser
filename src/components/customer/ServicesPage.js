import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import '../../styles/customer/ServicesPage.css'

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

    return (
        <div className='caterings-page-main'>
            {services.map(c => <div key={c.id} className='restaurant-list-element' onClick={() => history.push(`/ServiceListingPage${c.id}`)}>
                <div className='restaurant-listing' >
                    <div className='overlay-listing' >
                        <div className='overlay-listing-left'>
                            {c.type + " " + c.firstName + " " + c.lastName}<br />
                            {c.description}
                        </div>
                        <div className='overlay-listing-right'>
                            Service cost: {c.serviceCost} pln<br />
                        </div>
                    </div>
                    <div className='rest-listing-pics'>
                    </div>
                </div>
            </div>)}
        </div>)
}