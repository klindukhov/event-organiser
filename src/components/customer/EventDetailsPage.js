/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import '../../styles/customer/NewEventPage.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import pplIcon from '../../images/pplIcon.png';
import { useParams } from 'react-router-dom';
import apiFetch from '../../api';


export default function EventDetailsPage(props) {
    const { id } = useParams();
    const [isNew, setIsNew] = useState(true);
    useEffect(() => {
        if (id === 'new') {
            props.setHeaderMessage('New event');
            setIsNew(true);
        } else {
            props.setHeaderMessage('Event settings');
            setIsNew(false);
        }
    }, []);

    const history = useHistory();

    const [isLocPicked, setIsLocPicked] = useState(false);
    useEffect(() => {
        if (JSON.parse(window.localStorage.getItem('locationDetails')) !== undefined && JSON.parse(window.localStorage.getItem('locationDetails')) !== null) {
            setIsLocPicked(true);
        }
    }, [])

    const [isCatPicked, setIsCatPicked] = useState(false);

    const [isServicePicked, setIsServicePicked] = useState(false);


    const [newGuestPanel, setNewGuestPanel] = useState(false);
    const [guestList, setGuestList] = useState([]);
    useEffect(() => { if (JSON.parse(window.localStorage.getItem('guestList'))) { if (JSON.parse(window.localStorage.getItem('guestList')).length > 0) { setGuestList(JSON.parse(window.localStorage.getItem('guestList'))) } } }, [])

    const [guestBook, setGuestBook] = useState([]);
    useEffect(() => {
        apiFetch(`guests/customer?customerId=${props.userId}`)
            .then(result => setGuestBook(result))
            .catch(error => console.log('error', error));
    }, [props.userId])


    const [name, setGuestName] = useState('')
    const [surname, setGuestSurname] = useState('')
    const [email, setGuestEmail] = useState('')

    const addNewGuest = () => {
        setGuestList([
            ...guestList,
            {
                name: name,
                surname: surname,
                email: email
            }
        ]);
        setNewGuestPanel(false);
    }

    useEffect(() => {
        if (guestList.length > 0) {
            window.localStorage.setItem('guestList', JSON.stringify(guestList));
        }
    }, [guestList])

    const handleSelectGuestFromBook = e => {
        document.getElementById('newGuestName').defaultValue = JSON.parse(e.target.value).firstName;
        setGuestName(JSON.parse(e.target.value).firstName)
        document.getElementById('newGuestSurname').defaultValue = JSON.parse(e.target.value).lastName;
        setGuestSurname(JSON.parse(e.target.value).lastName)
        document.getElementById('newGuestEmail').defaultValue = JSON.parse(e.target.value).email;
        setGuestEmail(JSON.parse(e.target.value).email)
    }

    const handleGuestDelete = id => {
        let temp = [...guestList];
        temp.splice(id, 1);
        setGuestList(temp);
        if (temp.length === 0) {
            props.setGuests([]);
        }
    }


    const [eventName, setEventName] = useState('');
    useEffect(() => { if (eventName !== '') { window.localStorage.setItem('eventName', eventName) } else { setEventName(window.localStorage.getItem('eventName')) } }, [eventName])
    const [guestNum, setGuestNum] = useState('');
    useEffect(() => { if (guestNum !== '') { let t = JSON.parse(window.sessionStorage.getItem('filters')); t.guestNum = guestNum; window.sessionStorage.setItem('filters', JSON.stringify(t)) } }, [guestNum])
    const [eDate, setEDate] = useState('');
    useEffect(() => { if (eDate !== '') { let t = JSON.parse(window.sessionStorage.getItem('filters')); t.date = eDate; window.sessionStorage.setItem('filters', JSON.stringify(t)) } }, [eDate])
    const [eStart, setEStart] = useState('');
    useEffect(() => { if (eStart !== '') { window.localStorage.setItem('eStart', eStart) } else { setEStart(window.localStorage.getItem('eStart')) } }, [eStart])
    const [eEnd, setEEnd] = useState('');
    useEffect(() => { if (eEnd !== '') { window.localStorage.setItem('eEnd', eEnd) } else { setEEnd(window.localStorage.getItem('eEnd')) } }, [eEnd])
    const [eventType, setEventType] = useState('');
    useEffect(() => { if (eventType !== '') { let t = JSON.parse(window.sessionStorage.getItem('filters')); t.eventType = eventType; window.sessionStorage.setItem('filters', JSON.stringify(t)) } }, [eventType])
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        apiFetch(`events/types/allowed/all`)
            .then(result => setEventTypes(result))
            .catch(error => console.log('error', error));
    }, [])

    useEffect(() => {
        try {
            setGuestNum(JSON.parse(window.sessionStorage.getItem('filters')).guestNum);
            setEDate(JSON.parse(window.sessionStorage.getItem('filters')).date);
            setEventType(JSON.parse(window.sessionStorage.getItem('filters')).eventType);
        } catch (e) { }

    }, [])

    const [formError, setFormError] = useState(false);
    const handleCreateEvent = () => {
        if (props.authorized === false) {
            history.push('/SignIn');
        } else if (eventType !== '' && eventType !== 'Event type' && eventName !== '' && eDate !== '' && eStart !== '' && eEnd !== '' && guestNum !== '') {
            const raw = JSON.stringify({ "name": eventName, "date": eDate, "startTime": eStart, "endTime": eEnd, "guestCount": guestNum, "eventType": eventType });

            apiFetch(`events?customerId=${props.userId}`, "POST", raw)
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    history.push(`/EventDetailsPage/${result.id}`);
                    window.location.reload();
                })
                .catch(error => console.log('error', error));

            setFormError(false);
        } else {
            setFormError(true);
        }

    }

    useEffect(() => { if (window.localStorage.cateringInfo && JSON.parse(window.localStorage.cateringInfo).length > 0) { setIsCatPicked(true) } }, [window.localStorage.cateringInfo])
    useEffect(() => { if (window.localStorage.serviceInfo && JSON.parse(window.localStorage.serviceInfo).length > 0) { setIsServicePicked(true) } }, [window.localStorage.serviceInfo])

    const today = () => {
        let today = new Date();
        let d = today.getDate() + 1;
        let m = today.getMonth() + 1;
        let y = today.getFullYear();
        if (d < 10) {
            d = '0' + d
        }
        if (m < 10) {
            m = '0' + m
        }
        return y + '-' + m + '-' + d;
    }

    const handleLocationClick = () => {
        history.push(`/ItemDetails/Venue/${JSON.parse(window.localStorage.getItem('locationDetails')).id}`);
    }

    const handleDeleteCatering = (c) => {
        let t = JSON.parse(window.localStorage.getItem('cateringInfo'));
        t.splice(t.indexOf(c), 1);
        window.localStorage.setItem('cateringInfo', JSON.stringify(t));
        window.location.reload();
    }

    const handleDeleteService = (c) => {
        let t = JSON.parse(window.localStorage.getItem('serviceInfo'));
        t.splice(t.indexOf(c), 1);
        window.localStorage.setItem('serviceInfo', JSON.stringify(t));
        window.location.reload();
    }

    return (
        <div className='main'>
            <div className='block'>
                Event Name: <input className='input' defaultValue={eventName} onChange={e => setEventName(e.target.value)} disabled={!isNew} /><br />
                Number of guests: <input className='input' type='number' defaultValue={guestNum} onChange={e => setGuestNum(e.target.value)} disabled={!isNew} /><br />
                Date: <input className='input' type='date' min={today()} defaultValue={eDate} onChange={e => setEDate(e.target.value)} disabled={!isNew} /><br />
                Start time: <input className='input' type='time' defaultValue={eStart} onChange={e => setEStart(e.target.value)} disabled={!isNew} /><br />
                End time: <input className='input' type='time' defaultValue={eEnd} onChange={e => setEEnd(e.target.value)} disabled={!isNew} /><br />
                Event type: <select name="Event type" className='input' onChange={(event) => setEventType(event.target.value)} disabled={!isNew}>
                    <option value={eventType}>{eventType}</option>
                    {eventTypes.map(t => <option value={t.type} key={t.type}>{t.type}</option>)}
                </select>
                {formError && <p style={{ color: 'red', textAlign: 'center' }}>Please fill in all the fields</p>}
            </div>
            <div className='block'>
                <p className='venue-choice-heading'>
                    Venue
                    {isLocPicked && isNew && <input type='button' value='x' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} onClick={() => {
                        window.localStorage.setItem('locationDetails', null);
                        setIsLocPicked(false);
                    }} />}</p>
                {isLocPicked &&
                    <div className='item-list-element' style={{ justifySelf: 'center', width: '1420px' }} onClick={handleLocationClick} >
                        <div className='list-item' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left' >
                                    {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[1]} , {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[10].city}, {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[10].streetName}/{Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[10].streetNumber}<br />
                                    {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[6]}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[4]}
                                </div>
                                <div className='overlay-listing-right'>
                                    From {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[8]}pln/day<br />

                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {Object.values(JSON.parse(window.localStorage.getItem('locationDetails')))[18].map(i => <div key={i.alt}>
                                    <img alt={Object.values(i)[1]} className='list-item-pic' src={Object.values(i)[0]} />
                                </div>)}
                            </div>
                        </div>
                    </div>
                }
                {isLocPicked && !isNew &&
                    <p className='venue-choice-heading'>Status: </p>
                }
                {!isLocPicked &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push('/ListPage/Venues')} />
                }
            </div>
            {isLocPicked && !isNew &&
                <div className='block'>
                    <p className='venue-choice-heading'>Caterings</p>
                    {isCatPicked &&
                        <div>
                            {JSON.parse(window.localStorage.getItem('cateringInfo')).map && JSON.parse(window.localStorage.getItem('cateringInfo')).map(c =>
                                <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto auto' }} >
                                    <div className='list-item' style={{ width: '1420px' }} onClick={() => history.push(`/ItemDetails/Catering/${c.id}`)}>
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
                                    <input type='button' value='x' className='x-button' onClick={() => handleDeleteCatering(c)} />
                                </div>)}
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Caterings/${id}`)} />

                </div>
            }
            {isLocPicked && !isNew &&
                <div className="block">
                    <p className="venue-choice-heading">Services</p>
                    {isServicePicked &&
                        <div>
                            {JSON.parse(window.localStorage.getItem('serviceInfo')).map && JSON.parse(window.localStorage.getItem('serviceInfo')).map(c =>
                                <div key={c.id} className='list-item' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto auto' }} >
                                    <div className='list-item' style={{ width: '1420px' }} onClick={() => history.push(`/ItemDetails/Service/${c.id}`)}>
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
                                    <input type='button' value='x' className='x-button' onClick={() => handleDeleteService(c)} />
                                </div>)
                            }
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Services/${id}`)} />
                </div>
            }

            {isLocPicked && !isNew &&
                <div className='block'>
                    <p className='guest-choice-heading'>Guests</p>
                    {guestList.map(guest =>
                        <div className='guest-list-element' key={guestList.indexOf(guest)}>
                            {guest.name} {guest.surname} {guest.email}
                            <input type='button' value='x' className='x-button' onClick={() => handleGuestDelete(guestList.indexOf(guest))} />
                        </div>
                    )}
                    {newGuestPanel &&
                        <div className='new-guest-panel'>
                            <select className='select-guest' onChange={handleSelectGuestFromBook}>
                                <option value=''>Pick from guest book</option>
                                {props.authorized && guestBook.map(guest => <option key={guest.id} value={JSON.stringify(guest)}>{guest.firstName + " " + guest.lastName + " (" + guest.email + ')'}</option>)}
                            </select><br />
                            <input className='new-guest-input' id='newGuestName' placeholder='name' onChange={e => setGuestName(e.target.value)} />
                            <input className='new-guest-input' id='newGuestSurname' placeholder='surname' onChange={e => setGuestSurname(e.target.value)} />
                            <input className='new-guest-input' id='newGuestEmail' type='email' placeholder='email' onChange={e => setGuestEmail(e.target.value)} />
                            <input className='new-guest-button' type='button' value='Add guest' onClick={addNewGuest} />
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => setNewGuestPanel(true)} />
                </div>
            }

            {isLocPicked && isNew &&
                <div className='block' onClick={handleCreateEvent} style={{ textAlign: 'center', cursor: 'pointer' }}>
                    Create event and request location booking <br />
                </div>
            }
        </div>
    )
}