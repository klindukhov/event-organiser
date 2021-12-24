import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import '../../styles/admin/UserDetailsPage.css'

import pplIcon from '../../images/pplIcon.png';


export default function UserDetailsPage() {
    const { id } = useParams();

    const history = useHistory();

    const [details, setDetails] = useState({});

    const [caterings, setCaterings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [services, setServices] = useState([]);

  //  const [reservations, setReservations] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/users?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(result => setDetails(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (details.type === 'B') {
            var myHeaders = new Headers();

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
                credentials: 'include'
            };

            fetch(`http://localhost:8080/api/caterings/business?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => setCaterings(result))
                .catch(error => console.log('error', error));

            fetch(`http://localhost:8080/api/locations/business?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => setLocations(result))
                .catch(error => console.log('error', error));

            fetch(`http://localhost:8080/api/services/business?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => setServices(result))
                .catch(error => console.log('error', error));
        }// eslint-disable-next-line
    }, [details])

    const handleVerify = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/business/verify?id=${id}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        window.location.reload();

    }
    const handleBan = () => {

    }


    return (<div className="problem-details-main">
        <div className="problem-rect">
            <p className="problem-heading">User information</p>
            User id: {details.id}<br />
            User type: {details.type}<br />
            User email: {details.email}<br />
            User Name: {details.type === 'C' && details.customer.firstName} {details.type === 'B' && details.business.firstName}<br />
            User Surname: {details.type === 'C' && details.customer.lastName} {details.type === 'B' && details.business.lastName}<br />
            {details.type === 'C' && <>
                Birthdate: {details.customer.birthdate}<br />
                Phone number: {details.customer.phoneNumber}<br />
            </>
            }
            {details.type === 'B' && <>
                Business name: {details.business.businessName}<br />
                Phone number: {details.business.phoneNumber}<br />
                Verification: {details.business.verificationStatus} {details.business.verificationStatus !== 'VERIFIED' && <input type='button' className="verify-buttion" value='Mark verified' onClick={handleVerify} />}<br />
                Address: {details.business.address.streetName} {details.business.address.streetNumber}, {details.business.address.city}, {details.business.address.zipCode},  {details.business.address.country}<br />
            </>}
            Active: {'' + details.active} <input type='button' className="verify-buttion" value='Deactivate' onClick={handleBan} />
        </div>
        {details.type === 'C' &&
            <div className="reservations-heading-rect">
                <p className="problem-heading">Reservations</p>
            </div>}
        {details.type === 'B' && locations.length !== 0 &&
            <div className="reservations-heading-rect">
                <p className="problem-heading">Locations</p>
                {locations.map(c => <div key={c.name} className='item-list-element' style={{ justifySelf: 'center', width: '1420px' }} >
                    <Link to={`/RestaurantPage${Object.values(c)[0]}`} style={{ textDecoration: 'none' }}>
                        <div className='list-item' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left' >
                                    {Object.values(c)[1]} , {Object.values(c)[10].city}, {Object.values(c)[10].streetName}/{Object.values(c)[10].streetNumber}<br />
                                    {Object.values(c)[6]}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {Object.values(c)[4]}
                                </div>
                                <div className='overlay-listing-right'>
                                    From {Object.values(c)[8]}pln/day
                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {Object.values(c)[18].map(i => <div key={i.id}>
                                    <img alt={Object.values(i)[1]} className='list-item-pic' src={Object.values(i)[0]} />
                                </div>)}
                            </div>
                        </div>
                    </Link>
                </div>)}
            </div>}
        {details.type === 'B' &&  caterings.length !== 0 &&
            <div className="reservations-heading-rect" >
                <p className="problem-heading">Caterings</p>
                {caterings.map(c => <div key={c.name} className='item-list-element' style={{ justifySelf: 'center', width: '1420px' }} onClick={() => history.push(`/CateringListingPage${c.id}`)}>
                    <div className='list-item' style={{ width: '1420px' }}>
                        <div className='overlay-listing' style={{ width: '1420px' }}>
                            <div className='overlay-listing-left'>
                                {c.name}<br />
                                {c.description}
                            </div>
                            <div className='overlay-listing-right'>
                                Service cost: {c.serviceCost} pln<br />
                            </div>
                        </div>
                        <div className='list-item-pics' style={{ width: '1420px' }}>
                        </div>
                    </div>
                </div>)}
            </div>}
        {details.type === 'B' && services.length !== 0 &&
            <div className="reservations-heading-rect">
                <p className="problem-heading">Services</p>
                {services.map(c => <div key={c.id} className='list-item' style={{ justifySelf: 'center', width: '1420px' }} onClick={() => history.push(`/ServiceListingPage${c.id}`)}>
                    <div className='list-item' style={{ width: '1420px' }}>
                        <div className='overlay-listing' style={{ width: '1420px' }}>
                            <div className='overlay-listing-left'>
                                {c.type + " " + c.firstName + " " + c.lastName}<br />
                                {c.description}
                            </div>
                            <div className='overlay-listing-right'>
                                Service cost: {c.serviceCost} pln<br />
                            </div>
                        </div>
                        <div className='list-item-pics'>
                        </div>
                    </div>
                </div>)}
            </div>}
    </div>)
}