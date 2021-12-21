import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/business/BusinessLocationsPage.css'

export default function BusinessLocationsPage(props) {
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('My Locations') }, [])

    const history = useHistory();

    const [locations, setLocations] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/locations/business?id=${props.userId}`, requestOptions)
            .then(response => response.json())
            .then(result => setLocations(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line
    }, [props])

    const handleAddLocation = () =>{
        history.push('/AddBusinessPage')
    }

    return (<div className='business-home-main'>
        {locations.map(l => <div className='add-location-rect' key={l.id}>
                {l.name}
            </div>)
        }
        <div className='add-location-rect' onClick={handleAddLocation}>
            Add location
        </div>
    </div>)
}