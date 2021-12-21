import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/business/BusinessCateringsPage.css'

export default function BusinessCateringsPage(props) {
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('My Caterings') }, [])

    const history = useHistory();

    const [caterings, setCaterings] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/caterings/business?id=${props.userId}`, requestOptions)
            .then(response => response.json())
            .then(result => setCaterings(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line
    }, [props])


    const handleAddLocation = () => {
        history.push('/AddBusinessPage')
    }

    return (<div className='business-home-main'>
        {caterings.map(l => <div className='add-location-rect' key={l.id}>
                {l.name}
            </div>)
        }

        <div className='add-location-rect' onClick={handleAddLocation}>
            Add catering
        </div>
    </div>)
}