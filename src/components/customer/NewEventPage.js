/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import '../../styles/customer/NewEventPage.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function NewEventPage(props) {
    useEffect(() => { props.setHeaderMessage('New event') }, []);
    const [cart, setCart] = useState({});
    useEffect(() => { setCart(props.cart) }, [props.cart])
    const history = useHistory();

    const [isLocPicked, setIsLocPicked] = useState(false);
    useEffect(() => { if (cart !== null) { if (cart.locationDetails) { setIsLocPicked(true) } } }, [cart])

    const [isCatPicked, setIsCatPicked] = useState(false);
    useEffect(() => { if (cart !== null) { if (cart.catering) { setIsCatPicked(true) } } }, [cart])

    const [isServicePicked, setIsServicePicked] = useState(false);
    useEffect(() => { if (cart !== null) { if (cart.service) { setIsServicePicked(true) } } }, [cart])

    const [newGuestPanel, setNewGuestPanel] = useState(false);
    const [guestList, setGuestList] = useState([]);
    useEffect(() => { if (cart !== null) { if (cart.guests) { setGuestList(cart.guests) } } }, [cart])

    const [guestBook, setGuestBook] = useState([]);
    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/guests/customer?customerId=${props.userId}`, requestOptions)
            .then(response => response.json())
            .then(result => setGuestBook(result))
            .catch(error => console.log('error', error));
    }, [props.userId])


    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')


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
            props.setGuests(guestList);
        }
    }, [guestList])

    const handleSelectGuest = e => {
        document.getElementById('newGuestName').defaultValue = JSON.parse(e.target.value).firstName;
        setName(JSON.parse(e.target.value).firstName)
        document.getElementById('newGuestSurname').defaultValue = JSON.parse(e.target.value).lastName;
        setSurname(JSON.parse(e.target.value).lastName)
        document.getElementById('newGuestEmail').defaultValue = JSON.parse(e.target.value).email;
        setEmail(JSON.parse(e.target.value).email)
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
    const [guestNum, setGuestNum] = useState('');
    const [eDate, setEDate] = useState('');
    const [eStart, setEStart] = useState('');
    const [eEnd, setEEnd] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/events/types/allowed/all", requestOptions)
            .then(response => response.json())
            .then(result => setEventTypes(result))
            .catch(error => console.log('error', error));
    }, [])

    useEffect(() => {
        try {
            setGuestNum(props.filtersProp.guestNum);
            setEDate(props.filtersProp.date);
            setEventType(props.filtersProp.eventType);
        } catch (e) { }

    }, [])

    const [formError, setFormError] = useState(false);
    const handleCreateEvent = () => {
        if (eventType !== '' && eventType !== 'Event type' && eventName !== '' && eDate !== '' && eStart !== '' && eEnd !== '' && guestNum !== '') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "name": eventName, "date": eDate, "startTime": eStart, "endTime": eEnd, "guestCount": guestNum, "eventType": eventType });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
                credentials: 'include'
            };

            fetch(`http://localhost:8080/api/events?customerId=${props.userId}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            setFormError(false);
        } else {
            setFormError(true)
        }

    }

    return (
        <div className='main'>
            <div className='block'>
                Event Name: <input className='input' onChange={e => setEventName(e.target.value)} /><br />
                Number of guests: <input className='input' defaultValue={guestNum} onChange={e => setGuestNum(e.target.value)} /><br />
                Date: <input className='input' type='date' defaultValue={eDate} onChange={e => setEDate(e.target.value)} /><br />
                Start time: <input className='input' type='time' onChange={e => setEStart(e.target.value)} /><br />
                End time: <input className='input' type='time' onChange={e => setEEnd(e.target.value)} /><br />
                Event type: <select name="Event type" className='input' defaultValue={eventType} onChange={(event) => setEventType(event.target.value)}>
                    <option value=" ">Event type</option>
                    {eventTypes.map(t => <option value={t.type} key={t.type}>{t.type}</option>)}
                </select>
            </div>
            <div className='block'>
                <p className='venue-choice-heading'>Venue</p>
                {isLocPicked &&
                        <div className='pic-div'>
                            <img alt={props.cart.locationDetails.images[0].alt} src={props.cart.locationDetails.images[0].image} className='location-pic' />
                            <div className='venue-name-over'>{props.cart.locationDetails.name}
                                <input type='button' value='x' style={{ color: 'white', backgroundColor: 'transparent', borderColor: 'transparent' }} onClick={() => {
                                    props.setCatering('');
                                    props.setService('');
                                    props.setLocation('');
                                    setIsCatPicked(false);
                                    setIsServicePicked(false);
                                    setIsLocPicked(false);
                                }} /></div>
                        </div>
                }
                {!isLocPicked &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push('/ListPage/Venues')} />
                }
            </div>
            {isLocPicked && <div className='block'>
                <p className='venue-choice-heading'>Catering</p>
                {!isCatPicked &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push('/ListPage/Caterings')} />
                }
                {isCatPicked &&
                    <div>
                        {props.cart.catering.name} <input type='button' className='x-button' value='x' onClick={() => { props.setCatering(''); setIsCatPicked(false) }} />
                    </div>
                }
            </div>}
            {isLocPicked && <div className='block'>
                <p className='venue-choice-heading'>Services</p>
                {isServicePicked &&
                    <div>
                        {props.cart.service.type} <input type='button' value='x' className='x-button' onClick={() => { props.setService(''); setIsServicePicked(false) }} />
                    </div>
                }
                {!isServicePicked &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push('/ListPage/Services')} />
                }<br />
            </div>}
            {isLocPicked &&
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
                            <select className='select-guest' onChange={handleSelectGuest}>
                                <option value=''>Pick from guest book</option>
                                {props.authorized && guestBook.map(guest => <option key={guest.id} value={JSON.stringify(guest)}>{guest.firstName + " " + guest.lastName + " (" + guest.email + ')'}</option>)}
                            </select><br />
                            <input className='new-guest-input' id='newGuestName' placeholder='name' onChange={e => setName(e.target.value)} />
                            <input className='new-guest-input' id='newGuestSurname' placeholder='surname' onChange={e => setSurname(e.target.value)} />
                            <input className='new-guest-input' id='newGuestEmail' type='email' placeholder='email' onChange={e => setEmail(e.target.value)} />
                            <input className='new-guest-button' type='button' value='Add guest' onClick={addNewGuest} />
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => setNewGuestPanel(true)} />
                </div>
            }

            <div className='block' onClick={handleCreateEvent} style={{ textAlign: 'center' }}>
                Create event and request location booking <br /> {formError && <p style={{ color: 'red' }}>Please input correct information about an event</p>}
            </div>

        </div>
    )
}