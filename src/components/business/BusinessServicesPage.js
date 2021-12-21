import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/business/BusinessServicesPage.css'

export default function BusinessServicesPage(props) {
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('My Services') }, [])

    const history = useHistory();

    const [services, setServices] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/services/business?id=${props.userId}`, requestOptions)
            .then(response => response.json())
            .then(result => setServices(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line
    }, [props])


    const handleAddLocation = () => {
        history.push('/AddBusinessPage')
    }

    return (<div className='business-home-main'>
        {services.map(l => <div className='add-location-rect'>
                {l.type}
            </div>)
        }

        <div className='add-location-rect' onClick={handleAddLocation}>
            Add service
        </div>
    </div>)
}