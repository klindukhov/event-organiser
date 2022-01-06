import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import '../../styles/admin/UserDetailsPage.css'

import pplIcon from '../../images/pplIcon.png';
import apiFetch from "../../api";


export default function UserDetailsPage() {
    const { id } = useParams();

    const history = useHistory();

    const [details, setDetails] = useState({});

    const [caterings, setCaterings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [services, setServices] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventsTab, setEventsTab] = useState('ALL');

    //  const [reservations, setReservations] = useState([]);

    useEffect(() => {
        apiFetch(`users?id=${id}`)
            .then(result => setDetails(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (details.type === 'B') {
            apiFetch(`caterings/business?id=${id}`)
                .then(result => setCaterings(result))
                .catch(error => console.log('error', error));

            apiFetch(`locations/business?id=${id}`)
            .then(result => setLocations(result))
            .catch(error => console.log('error', error));
            
            apiFetch(`services/business?id=${id}`)
                .then(result => setServices(result))
                .catch(error => console.log('error', error));
        } else if (details.type === 'C') {
            getAllEvents();
        }

        // eslint-disable-next-line
    }, [details])

    useEffect(() => {
        if(details.type === 'C'){
            getAllEvents();
        }
        // eslint-disable-next-line
    }, [eventsTab])

    const getAllEvents = () => {
        apiFetch(`events/customer?customerId=${id}&tab=${eventsTab}`)
            .then(result => setEvents(result))
            .catch(error => console.log('error', error));
    }

    const handleVerify = () => {
        apiFetch(`business/verify?id=${id}`, "PUT")
            .catch(error => console.log('error', error));

        window.location.reload();

    }
    const handleBan = () => {

    }

    const [eventPastColor, setEventPastColor] = useState('#47525e');
    const [eventFutureColor, setEventFutureColor] = useState('#47525e');
    const [eventAllColor, setEventAllColor] = useState('white');
    const [eventPastBackColor, setEventPastBackColor] = useState('#e5e5e5');
    const [eventFutureBackColor, setEventFutureBackColor] = useState('#e5e5e5');
    const [eventAllBackColor, setEventAllBackrColor] = useState('#47525e');
    const handleEvents = (e) => {
        if (e.target.value === "all") {
            setEventPastColor('#47525e');
            setEventFutureColor('#47525e');
            setEventAllColor('white');
            setEventPastBackColor('#e5e5e5');
            setEventFutureBackColor('#e5e5e5');
            setEventAllBackrColor('#47525e');
            setEventsTab('ALL')
        } else if (e.target.value === "past") {
            setEventPastColor('white');
            setEventFutureColor('#47525e');
            setEventAllColor('#47525e');
            setEventPastBackColor('#47525e');
            setEventFutureBackColor('#e5e5e5');
            setEventAllBackrColor("#e5e5e5");
            setEventsTab('PAST')
        } else if (e.target.value === "future") {
            setEventPastColor('#47525e');
            setEventFutureColor('white');
            setEventAllColor('#47525e');
            setEventPastBackColor('#e5e5e5');
            setEventFutureBackColor('#47525e');
            setEventAllBackrColor('#e5e5e5');
            setEventsTab('CURRENT')
        }
    }


    return (<div className="main">
        <div className="block">
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
                Verification: {details.business.verificationStatus} {details.business.verificationStatus !== 'VERIFIED' && <input type='button' className="button" value='Mark verified' onClick={handleVerify} />}<br />
                Address: {details.business.address.streetName} {details.business.address.streetNumber}, {details.business.address.city}, {details.business.address.zipCode},  {details.business.address.country}<br />
            </>}
            Active: {'' + details.active} <input type='button' className="button" value='Deactivate' onClick={handleBan} />
        </div>
        {details.type === 'C' &&
            <div className="block">
                <p className="problem-heading">Events</p>
                <div className='event-filter-div'>
                    <input type='button' className='e-c-button-l' value='past' onClick={handleEvents} style={{ color: eventPastColor, backgroundColor: eventPastBackColor }} />
                    <input type='button' className='e-c-button-c' value='all' onClick={handleEvents} style={{ color: eventAllColor, backgroundColor: eventAllBackColor }} />
                    <input type='button' className='e-c-button-r' value='future' onClick={handleEvents} style={{ color: eventFutureColor, backgroundColor: eventFutureBackColor }} />
                </div>
                {events.map(c => <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px' }} onClick={() => history.push(`/ItemDetails/Event/${c.id}`)}>
                    <div className='list-item' style={{ width: '1420px' }}>
                        <div className='overlay-listing' style={{ width: '1420px' }}>
                            <div className='overlay-listing-left'>
                                {c.name}<br />
                                {c.date}, {c.startTime}{c.endTime !== c.startTime && '- ' + c.endTime}
                            </div>
                            <div className='overlay-listing-right'>
                                {c.eventType}<br />
                                {c.guestCount} people
                            </div>
                        </div>
                        <div className='list-item-pics' style={{ width: '1420px' }}>
                        </div>
                    </div>
                </div>)}
            </div>
        }
        {details.type === 'B' && locations.length > 0 && 
            <div className="block">
                <p className="problem-heading">Locations</p>
                {locations.map(c => <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px' }} >
                    <Link to={`/ItemDetails/Venue/${c.id}`} style={{ textDecoration: 'none' }}>
                        <div className='list-item' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left' >
                                    {c.name} , {c.address.city}, {c.address.streetName}, {c.address.streetNumber}<br />
                                    {c.description}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {c.seatingCapacity}
                                </div>
                                <div className='overlay-listing-right'>
                                    From {c.dailyRentCost}pln/day
                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {c.images.map(i => <div key={i.alt}>
                                    <img alt={Object.values(i)[1]} className='list-item-pic' src={Object.values(i)[0]} />
                                </div>)}
                            </div>
                        </div>
                    </Link>
                </div>)}
            </div>
        }
        {details.type === 'B' && caterings.length !== 0 &&
            <div className="block" >
                <p className="problem-heading">Caterings</p>
                {caterings.map(c => <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px' }} onClick={() => history.push(`/ItemDetails/Catering/${c.id}`)}>
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
            <div className="block">
                <p className="problem-heading">Services</p>
                {services.map(c => <div key={c.id} className='list-item' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px' }} onClick={() => history.push(`/ItemDetails/Service/${c.id}`)}>
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
            </div>
        }
    </div>)
}