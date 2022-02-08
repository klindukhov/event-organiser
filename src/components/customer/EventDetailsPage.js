/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import '../../styles/customer/NewEventPage.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import pplIcon from '../../images/pplIcon.png';
import { useParams } from 'react-router-dom';
import apiFetch from '../../api';
import { TextField, Button, IconButton, Select, FormControl, InputLabel, MenuItem, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

import VeganLogo from '../../images/veganLogo.png'
import VegetarianLogo from '../../images/vegetarianLogo.png'
import GlutenFreeLogo from '../../images/glutenFreeLogo.png'




export default function EventDetailsPage(props) {
    const { id } = useParams();
    const { adminUserId } = useParams();
    const [isNew, setIsNew] = useState(true);
    useEffect(() => {
        if (id === 'new') {
            props.setHeaderMessage('New event');
            setIsNew(true);
        } else {
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

    const [locStatus, setLocStatus] = useState('');
    const [locResId, setLocResId] = useState('');
    const [bookedCats, setBookedCats] = useState([]);
    const [canceledLocs, setCanceledLocs] = useState([]);
    const [bookedServices, setBookedServices] = useState([]);
    const [isEventReady, setIsEventReady] = useState('');
    const [isEventCancelled, setIsEventCancelled] = useState('');
    useEffect(() => {
        let userId = props.userId;
        if (props.userData && props.userData.type && props.userData.type === 'A') { userId = adminUserId }
        if (!isNew) {
            apiFetch(`events/detail?eventId=${id}&customerId=${userId}`).then(res => {
                props.setHeaderMessage(res.eventStatus === "READY" ? res.name + '(READY)' : res.eventStatus === "CANCELLED" ? res.name + '(CANCELLED)' : res.name);
                setIsEventReady(res.eventStatus === "READY");
                setIsEventCancelled(res.eventStatus === "CANCELLED");
                if (res.eventStatus === "READY") {
                    setGuestList(res.guests)
                }
                setEventName(res.name);
                setGuestNum(res.guestCount);
                setEDate(res.date);
                setEStart(res.startTime);
                setEEnd(res.endTime);
                setEventType(res.eventType);
                let temp = [];
                let locIndex = '';
                res.location.forEach(l => {
                    if (l.confirmationStatus !== "CANCELLED") {
                        setLocStatus(l.confirmationStatus)
                        setLocResId(l.id);
                        locIndex = res.location.indexOf(l);
                        window.localStorage.setItem('locationDetails', JSON.stringify(l.location));
                        let filts = JSON.parse(window.sessionStorage.getItem('filters'));
                        filts.location = l.location.address.city + ', ' + l.location.address.country;
                        window.sessionStorage.setItem('filters', JSON.stringify(filts));
                    } else {
                        temp.push(l);
                    }
                })
                setCanceledLocs(temp);
                setIsLocPicked(true);
                if (res.location[locIndex].caterings.length > 0) {
                    res.location[locIndex].caterings.forEach(c => {
                        apiFetch(`catering/items/allowed?cateringId=${c.catering.id}`)
                            .then(response => {
                                res.location[locIndex].caterings[res.location[locIndex].caterings.indexOf(c)].catering.cateringItems = response;
                                setBookedCats(res.location[locIndex].caterings);
                                let cTypes = { ...cateringItemTypes };
                                cTypes[`${c.catering.id}`] = response.map(l => l.type).filter((e, i) => response.map(l => l.type).indexOf(e) === i);
                                setCateringItemTypes(cTypes);
                            })
                    })
                }
                setBookedServices(res.location[locIndex].optionalServices);

            }).catch(e => console.log('error', e));
        }
    }, [isNew])

    const [isCatPicked, setIsCatPicked] = useState(false);

    const [isServicePicked, setIsServicePicked] = useState(false);


    const [newGuestPanel, setNewGuestPanel] = useState(false);
    const [guestList, setGuestList] = useState([]);
    useEffect(() => {
        if (JSON.parse(window.localStorage.getItem('guestList'))) {
            if (JSON.parse(window.localStorage.getItem('guestList')).length > 0) {
                setGuestList(JSON.parse(window.localStorage.getItem('guestList')))
            }
        }
    }, [])

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
        const raw = JSON.stringify({ "firstName": name, "lastName": surname, "email": email });

        apiFetch(`guests/new?customerId=${props.userId}`, "POST", raw).then(res => res.json()).then(res => {
            setGuestList([
                ...guestList,
                {
                    id: res.id,
                    name: name,
                    surname: surname,
                    email: email
                }
            ]);
            setNewGuestPanel(false);
        })
            .catch(error => console.log('error', error));

    }

    useEffect(() => {
        if (guestList.length >= 0) {
            window.localStorage.setItem('guestList', JSON.stringify(guestList));
        }
    }, [guestList])

    const handleSelectGuestFromBook = e => {
        if (!guestList.some(g => g.id === JSON.parse(e.target.value).id)) {
            setGuestList([
                ...guestList,
                {
                    id: JSON.parse(e.target.value).id,
                    name: JSON.parse(e.target.value).firstName,
                    surname: JSON.parse(e.target.value).lastName,
                    email: JSON.parse(e.target.value).email
                }
            ]);
        }
        setNewGuestPanel(false);
    }

    const handleGuestDelete = id => {
        let temp = [...guestList];
        temp.splice(id, 1);
        if (temp.length === 0) {
            setGuestList([]);
        } else {
            setGuestList(temp);
        }
    }


    const [eventName, setEventName] = useState('');
    useEffect(() => { if (eventName !== '') { window.localStorage.setItem('eventName', eventName) } else { setEventName(window.localStorage.getItem('eventName') === null ? '' : window.localStorage.getItem('eventName')) } }, [eventName])
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
        } else if (eventType !== '' && eventType !== 'Event type' && eventName !== '' && eDate !== '' && eStart !== '' && eEnd !== '' && guestNum !== '' && eventType !== null && eventName !== null && eDate !== null && eStart !== null && eEnd !== null && guestNum !== null) {
            apiFetch(`locations/allowed/available?locationId=${JSON.parse(window.localStorage.getItem('locationDetails')).id}&date=${eDate}&timeFrom=${eStart}&timeTo=${eEnd}`).then(res => {
                if (res === true) {
                    apiFetch(`events?customerId=${props.userId}`, "POST",
                        JSON.stringify({ "name": eventName, "date": eDate, "startTime": eStart, "endTime": eEnd, "guestCount": guestNum, "eventType": eventType }))
                        .then(res => res.json())
                        .then(result => {
                            apiFetch(`event/location?customerId=${props.userId}&eventId=${result.id}&locationId=${JSON.parse(window.localStorage.getItem('locationDetails')).id}`, "POST",
                                JSON.stringify({ "timeFrom": eStart, "timeTo": eEnd, "guestCount": guestNum }))
                                .then(() => {
                                    history.push(`/EventDetailsPage/${result.id}`);
                                    window.location.reload();
                                })
                                .catch(error => console.log('error', error));

                        })
                        .catch(error => console.log('error', error));
                    setFormError(false);
                } else {
                    alert('Chosen location unavaliable for dates of event');
                }
            })
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

    const [cateringErrorMessage, setCateringErrorMessage] = useState('');
    const handleReserveCaterings = () => {
        JSON.parse(window.localStorage.getItem('cateringInfo')).forEach(c => {
            let body = {};
            caterMessage.forEach(m => {
                if (m.id === c.id) {
                    body.comment = m.message;
                }
            })
            caterTime.forEach(m => {
                if (m.id === c.id) {
                    body.time = m.time;
                }
            })
            if (body.time > eEnd || body.time < eStart) {
                setCateringErrorMessage('The time of serving should be within the time frame of event');
            } else {
                apiFetch(`event/catering?customerId=${props.userId}&eventId=${id}&cateringId=${c.id}`, "POST", JSON.stringify(body))
                    .then(() => handleDeleteCatering(c)).catch(e => { console.log('error', e); setCateringErrorMessage('Catering seems to be unavailable, try changing time or choosing another') })
            }
        })
    }

    const [serviceTimeFrom, setServiceTimeFrom] = useState([]);
    const [serviceTimeTo, setServiceTimeTo] = useState([]);
    const [serviceMessage, setServiceMessage] = useState([]);
    const [serviceErrorMessage, setServiceErrorMessage] = useState('');

    const handleReserveServices = () => {
        JSON.parse(window.localStorage.getItem('serviceInfo')).forEach(c => {
            let body = {};
            serviceTimeFrom.forEach(m => {
                if (m.id === c.id) {
                    body.timeFrom = m.time;
                }
            })
            serviceTimeTo.forEach(m => {
                if (m.id === c.id) {
                    body.timeTo = m.time;
                }
            })
            serviceMessage.forEach(m => {
                if (m.id === c.id) {
                    body.comment = m.message;
                }
            })
            if (body.timeFrom > eEnd || body.timeFrom < eStart || body.timeTo > eEnd || body.timeTo < eStart) {
                setServiceErrorMessage('The time of serving should be within the time frame of event');
            } else {
                apiFetch(`services/allowed/available?serviceId=${c.id}&date=${eDate}&timeFrom=${body.timeFrom}&timeTo=${body.timeTo}`)
                    .then(res => {
                        if (res) {
                            apiFetch(`event/service?customerId=${props.userId}&eventId=${id}&serviceId=${c.id}`, "POST", JSON.stringify(body))
                                .then(() => handleDeleteService(c)).catch(e => console.log('error', e))
                        } else {
                            setServiceErrorMessage('The service is unavailable, please choose another one, or change the time frame');
                        }
                    }).catch(e => { console.log('error', e); setServiceErrorMessage('The service is unavailable, please choose another one, or change the time frame'); });
            }
        })
    }

    const [caterMessage, setCaterMessage] = useState([]);
    const [caterTime, setCaterTime] = useState([]);
    const [menuEditing, setMenuEditing] = useState({});

    const [cateringItemTypes, setCateringItemTypes] = useState({});

    const [order, setOrder] = useState({});
    const handleOrderEdit = (rId, itemId, quantity) => {
        let o = { ...order };
        if (o[rId] !== undefined) {
            if (o[rId].some(e => e.itemId === itemId)) {
                o[rId].splice(o[rId].indexOf(o[rId].find(e => e.itemId === itemId)), 1);
                o[rId].push({ "itemId": itemId, "amount": quantity });
            } else {
                o[rId].push({ "itemId": itemId, "amount": quantity });
            }
        } else {
            o[rId] = [{ "itemId": itemId, "amount": quantity }];
        }

        setOrder(o);
    }

    const handleOrderSubmit = rId => {
        apiFetch(`catering/order?reservationId=${rId}`, "POST", JSON.stringify(order[rId]))
            .then(res => { setOrder({}); window.location.reload(); }).catch(e => { console.log('error', e); setOrder({}) });
    }

    const handleEventReady = () => {
        let body = [];
        guestList.forEach(g => body.push(g.id));
        apiFetch(`customers/guests/invite?customerId=${props.userId}&eventId=${id}&guestIds=${JSON.stringify(body).substring(1, JSON.stringify(body).length - 1)}`, 'PUT')
            .then((res) => {
                if (res.ok) {
                    apiFetch(`customers/invite/send?id=${props.userId}&eventId=${id}`, "POST").then(res => { if (res.ok) { window.location.reload() } }).catch(e => console.log('error', e));
                }
            })
            .catch(e => console.log('error', e))

    }

    const isFinal = () => {
        let catStatus = true;
        let serStatus = true;
        bookedCats.forEach(e => {
            if (e.confirmationStatus === "NOT_CONFIRMED" || e.isOrderConfirmed === false) {
                catStatus = false;
            }
        })
        if (bookedServices !== null) {
            bookedServices.forEach(e => {
                if (e.confirmationStatus === "NOT_CONFIRMED") {
                    serStatus = false;
                }
            })
        }

        if (locStatus === "CONFIRMED" && catStatus && serStatus) {
            return true;
        } else {
            return false;
        }
    }

    const [locationCancellationMessage, setLocationCancellationMessage] = useState('');
    const handleCancel = (type, id) => {
        apiFetch(`event/${type}/cancel?id=${id}`, "DELETE").then(res => res.json()).then(res => { console.log(res); window.localStorage.setItem('locationDetails', null); window.location.reload() })
            .catch(e => { console.log('error', e); if (type === 'location') { setLocationCancellationMessage('You have to cancel caterings and services first') } })
    }

    const bookVenue = () => {
        if (props.authorized) {
            apiFetch(`locations/allowed/available?locationId=${JSON.parse(window.localStorage.getItem('locationDetails')).id}&date=${eDate}&timeFrom=${eStart}&timeTo=${eEnd}`).then(res => {
                if (res === true) {
                    apiFetch(`event/location?customerId=${props.userId}&eventId=${id}&locationId=${JSON.parse(window.localStorage.getItem('locationDetails')).id}`, "POST",
                        JSON.stringify({ "timeFrom": eStart, "timeTo": eEnd, "guestCount": guestNum }))
                        .then(() => {
                            window.location.reload();
                        })
                        .catch(error => console.log('error', error));
                } else {
                    alert('Chosen location unavaliable for dates of event');
                }
            })
        } else {
            history.push('/SignIn');
        }

    }

    const cancelEvent = () => {
        apiFetch(`events/cancel?id=${id}`, "DELETE").then(() => history.push('/ListPage/Events')).catch(e => console.log('error' + e));
    }

    return (
        <div className='main'>
            <div className='block'>
                <TextField size='small' margin='dense' label='Event name' InputLabelProps={!isNew ? { shrink: !isNew } : ''} style={{ width: '250px' }} value={eventName} onChange={e => setEventName(e.target.value)} disabled={!isNew} /><br />
                <TextField size='small' margin='dense' label='Guests' InputLabelProps={!isNew ? { shrink: !isNew } : ''} style={{ width: '250px' }} type='number' value={guestNum} onChange={e => setGuestNum(e.target.value)} disabled={!isNew} /><br />
                <TextField size='small' margin='dense' label='Date' InputLabelProps={{ shrink: true }} style={{ width: '250px' }} type='date' min={today()} value={eDate} onChange={e => setEDate(e.target.value)} disabled={!isNew} /><br />
                <TextField size='small' margin='dense' label='Start' InputLabelProps={{ shrink: true }} type='time' value={eStart} onChange={e => setEStart(e.target.value)} disabled={!isNew} />{' _ '}
                <TextField size='small' margin='dense' label='End' InputLabelProps={{ shrink: true }} type='time' value={eEnd} onChange={e => setEEnd(e.target.value)} disabled={!isNew} /><br />
                <FormControl size='small' margin='dense'>
                    <InputLabel>Event type</InputLabel>
                    <Select name="Event type" label='Event type' style={{ width: '250px' }} size='small' margin='dense' value={eventType} onChange={(event) => setEventType(event.target.value)} disabled={!isNew}>
                        {eventTypes.map(t => <MenuItem value={t.type} key={t.type}>{t.type}</MenuItem>)}
                    </Select>
                </FormControl>
                <br />
                {!isNew && !isEventCancelled && <Button variant='contained' onClick={cancelEvent}>Cancel event</Button>}
                {formError && <p style={{ color: 'red', textAlign: 'center' }}><br />Please fill in all the fields</p>}
            </div>
            {!isEventCancelled && <div className='block'>
                <p className='venue-choice-heading'>
                    Venue
                    {isLocPicked && isNew && <IconButton onClick={() => {
                        window.localStorage.setItem('locationDetails', null);
                        setIsLocPicked(false);
                    }}><DeleteIcon /></IconButton>}
                </p>
                {canceledLocs.length > 0 && canceledLocs.map(l => <p key={l.id}>
                    ⓘ Venue "{l.location.name}" reservation request is cancelled, please pick another venue
                </p>)}
                {isLocPicked && JSON.parse(window.localStorage.getItem('locationDetails')) !== null && JSON.parse(window.localStorage.getItem('locationDetails')).address &&
                    <div className='item-list-element' style={{ justifySelf: 'center', width: '1420px' }} onClick={handleLocationClick} >
                        <div className='list-item' style={{ width: '1420px' }}>
                            <div className='overlay-listing' style={{ width: '1420px' }}>
                                <div className='overlay-listing-left' >
                                    {JSON.parse(window.localStorage.getItem('locationDetails')).name} , {JSON.parse(window.localStorage.getItem('locationDetails')).address.city}, {JSON.parse(window.localStorage.getItem('locationDetails')).address.streetName}, {JSON.parse(window.localStorage.getItem('locationDetails')).address.streetNumber}<br />
                                    {JSON.parse(window.localStorage.getItem('locationDetails')).description}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {JSON.parse(window.localStorage.getItem('locationDetails')).seatingCapacity}
                                </div>
                                <div className='overlay-listing-right'>
                                    From {JSON.parse(window.localStorage.getItem('locationDetails')).dailyRentCost}pln/day<br />

                                </div>
                            </div>
                            <div className='list-item-pics' style={{ width: '1420px' }}>
                                {JSON.parse(window.localStorage.getItem('locationDetails')).images.map(i => <div key={i.name}>
                                    <img alt={i.encodedImage} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                </div>)}
                            </div>
                        </div>
                    </div>
                }
                {isLocPicked && !isNew && JSON.parse(window.localStorage.getItem('locationDetails')) !== null &&
                    <p style={{ fontSize: '14pt' }}>{locStatus !== '' && <><br />Status: {locStatus}<br /><br /></>}
                        {(locStatus === 'CONFIRMED' || locStatus === 'NOT_CONFIRMED') && !isEventReady && <Button variant='contained' size='small' className='button' onClick={() => handleCancel('location', locResId)}>
                            Cancel request
                        </Button>}
                        {locationCancellationMessage !== '' && <p style={{ color: 'red', fontSize: '12pt' }}>{locationCancellationMessage}</p>}
                        {(locStatus === '') && <Button variant='contained' size='small' className='button' onClick={() => bookVenue('location', locResId)}>
                            Book venue
                        </Button>}
                        {locStatus === '' &&
                            <Button style={{ fontSize: '30pt' }} onClick={() => history.push(`/ListPage/Venues/${id}`)} >+</Button>
                        }
                        {locStatus === 'NOT_CONFIRMED' && <><br />ⓘ You will be able to pick caterigs, services, and invite guests to your event after the reservation is confirmed by venue provider</>}
                    </p>
                }
                {(!isLocPicked || JSON.parse(window.localStorage.getItem('locationDetails')) === null) &&
                    <Button style={{ fontSize: '30pt' }} onClick={() => history.push(`/ListPage/Venues/${id}`)} >+</Button>
                }
            </div>}
            {isLocPicked && !isNew && locStatus === 'CONFIRMED' &&
                <div className='block'>
                    <p className='venue-choice-heading'>Caterings</p>
                    {bookedCats.length > 0 &&
                        <div>
                            {bookedCats.map(c => <div key={c.id}>{c.confirmationStatus === "CANCELLED" &&
                                <p>
                                    ⓘ Catering "{c.catering.name}" reservation is cancelled, please pick another one
                                </p>}</div>)}
                            {bookedCats.map(c => <div key={c.id}>{c.confirmationStatus !== "CANCELLED" &&
                                <div className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto' }} >
                                    <div className='list-item' style={{ width: '1420px' }} onClick={() => history.push(`/ItemDetails/Catering/${c.catering.id}`)}>
                                        <div className='overlay-listing' style={{ width: '1420px' }}>
                                            <div className='overlay-listing-left'>
                                                {c.catering.name}<br />
                                                {c.catering.description}
                                            </div>
                                            <div className='overlay-listing-right'>
                                                Service cost: {c.catering.serviceCost} pln<br />

                                            </div>
                                        </div>
                                        <div className='list-item-pics' style={{ width: '1420px' }}>
                                            {c.catering.images && c.catering.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <div>
                                        <br />
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'start', columnGap: '10px', alignItems: 'end' }}>
                                            <span style={{ fontSize: '12pt', justifySelf: 'start' }}>
                                                Message: </span>
                                            "{c.comment}"<br />
                                            <span style={{ fontSize: '12pt' }}>
                                                Serving time: </span>
                                            {c.time}<br />
                                            <span style={{ fontSize: '12pt' }}>
                                                Status: </span>
                                            {c.confirmationStatus}<br />
                                            <span style={{ fontSize: '12pt' }}>
                                                Order status: </span>
                                            {c.isOrderConfirmed ? 'Confirmed' : 'Not confirmed'}<br />
                                        </div>
                                        <br />
                                        {!isEventReady && <Button variant='contained' size='small' className='button' onClick={() => handleCancel('catering', c.id)}>
                                            Cancel request
                                        </Button>}<br />
                                        {c.confirmationStatus === "NOT_CONFIRMED" && <p style={{ fontSize: '12pt' }}>
                                            ⓘ You will be able to make an order after the reservation is confirmed by catering provider
                                        </p>
                                        }
                                        {c.confirmationStatus === "CONFIRMED" && c.order.length === 0 && !menuEditing.value &&
                                            <Button className='button' onClick={() => setMenuEditing({ 'value': true, 'id': c.id })}>Open menu</Button>
                                        }
                                        {c.order.length > 0 && <span style={{ fontSize: '12pt' }}>
                                            Order: </span>}
                                        {c.order.length > 0 && c.order.map(item => <li key={item.id}>{item.amount} x {item.item.name}</li>)}
                                        {menuEditing.value && menuEditing.id === c.id &&
                                            <div>
                                                {cateringItemTypes[c.catering.id] && <p className='item-review-heading'>Menu</p>}
                                                {cateringItemTypes[c.catering.id] && cateringItemTypes[c.catering.id].map(t => <div key={t}>
                                                    <p className='item-info-heading'>{t}s</p>
                                                    {c.catering.cateringItems.filter(l => l.type === t).map(item => <div className="catering-menu-item" key={item.id}>
                                                        <div className="menu-item-left"><span style={{ fontWeight: 'bold' }}>{item.name}</span><br />
                                                            {item.description}<br />
                                                        </div>
                                                        <div className="menu-item-right"><span style={{ fontWeight: 'bold' }}>{item.servingPrice}</span>
                                                            <TextField size='small' label='Quantity' InputLabelProps={{ shrink: true }} type='number' style={{ width: '100px' }} onChange={e => handleOrderEdit(c.id, item.id, e.target.value)} />
                                                            <br />
                                                            {item.isVegan && <Tooltip title='vegan'>
                                                                <img alt='vegan' src={VeganLogo} style={{ height: '30px', width: '30px' }} />
                                                            </Tooltip>}
                                                            {item.isVegetarian && <Tooltip title='vegetarian'>
                                                                <img alt='vegan' src={VegetarianLogo} style={{ height: '30px', width: '30px' }} />
                                                            </Tooltip>}
                                                            {item.isGlutenFree && <Tooltip title='gluten free'>
                                                                <img alt='vegan' src={GlutenFreeLogo} style={{ height: '30px', width: '30px' }} />
                                                            </Tooltip>}
                                                            <br />
                                                        </div>
                                                    </div>)}
                                                </div>)}
                                                {!cateringItemTypes[c.catering.id] && <>
                                                    Leave your order here<br />
                                                    <textarea /><br />
                                                </>}
                                                <Button variant='contained' size='medium' margin='dense' onClick={() => { setMenuEditing({ 'value': false, 'id': c.id }); handleOrderSubmit(c.id) }}>Confirm order</Button><br />
                                                <Button variant='contained' size='small' margin='dense' onClick={() => setMenuEditing({ 'value': false, 'id': c.id })}>Cancel</Button>
                                            </div>
                                        }
                                    </div>
                                </div>}</div>)
                            }
                        </div>
                    }
                    {isCatPicked &&
                        <div>
                            {JSON.parse(window.localStorage.getItem('cateringInfo')).map && JSON.parse(window.localStorage.getItem('cateringInfo')).map(c =>
                                <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1400px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto auto' }} >
                                    <div className='list-item' style={{ width: '1400px' }} onClick={() => history.push(`/ItemDetails/Catering/${c.id}`)}>
                                        <div className='overlay-listing' style={{ width: '1400px' }}>
                                            <div className='overlay-listing-left'>
                                                {c.name}<br />
                                                {c.description}
                                            </div>
                                            <div className='overlay-listing-right'>
                                                Service cost: {c.serviceCost} pln<br />

                                            </div>
                                        </div>
                                        <div className='list-item-pics' style={{ width: '1400px' }}>
                                            {c.images && c.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <IconButton onClick={() => handleDeleteCatering(c)}><DeleteIcon /></IconButton>
                                    <div>
                                        <br />
                                        <TextField size='small' margin='dense' style={{ width: '400px' }} multiline label='Message for catering provider' onChange={e => setCaterMessage([...caterMessage, { 'message': e.target.value, 'id': c.id }])} /><br />
                                        <TextField size='small' margin='dense' InputLabelProps={{ shrink: true }} type='time' label='Serving time' onChange={e => setCaterTime([...caterTime, { 'time': e.target.value, 'id': c.id }])} />
                                    </div>
                                </div>)}
                        </div>
                    }
                    {!isEventReady && <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Caterings/${id}`)} />}<br />
                    {JSON.parse(window.localStorage.getItem('cateringInfo')) && JSON.parse(window.localStorage.getItem('cateringInfo')).length > 0 &&
                        <Button variant='contained' className='button' onClick={handleReserveCaterings}>Request caterings booking</Button>
                    }
                    <p style={{ color: 'red' }}>{cateringErrorMessage}</p>

                </div>
            }
            {isLocPicked && !isNew && locStatus === 'CONFIRMED' &&
                <div className="block">
                    <p className="venue-choice-heading">Services</p>
                    {bookedServices && bookedServices.length > 0 &&
                        <div>
                            {bookedServices.map(c => <div key={c.id}>{c.confirmationStatus === "CANCELLED" &&
                                <p>
                                    ⓘ "{c.optionalService.type + " " + c.optionalService.firstName + " " + c.optionalService.lastName}" reservation is cancelled, please pick another one
                                </p>}</div>)}
                            {bookedServices.map(c => <div >{c.confirmationStatus !== "CANCELLED" &&
                                <div className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px' }} >
                                    <div className='list-item' style={{ width: '1420px' }} onClick={() => history.push(`/ItemDetails/Service/${c.optionalService.id}`)}>
                                        <div className='overlay-listing' style={{ width: '1420px' }}>
                                            <div className='overlay-listing-left'>
                                                {c.optionalService.type + " " + c.optionalService.firstName + " " + c.optionalService.lastName}<br />
                                                {c.optionalService.description}
                                            </div>
                                            <div className='overlay-listing-right'>
                                                Service cost: {c.optionalService.serviceCost} pln<br />
                                            </div>
                                        </div>
                                        <div className='list-item-pics' style={{ width: '1420px' }}>
                                            {c.optionalService.images && c.optionalService.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <div>
                                        <br />
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'start', columnGap: '10px', alignItems: 'end' }}>
                                            <span style={{ fontSize: '12pt', justifySelf: 'start' }}>
                                                Message: </span>
                                            "{c.comment}"<br />
                                            <span style={{ fontSize: '12pt' }}>
                                                Serving time: </span>
                                            {c.timeFrom + " - " + c.timeTo}<br />
                                            <span style={{ fontSize: '12pt' }}>
                                                Status: </span>
                                            {c.confirmationStatus}<br />
                                        </div>
                                        <br />
                                        {!isEventReady && <><Button variant='contained' size='small' className='button' onClick={() => handleCancel('service', c.id)}>
                                            Cancel request
                                        </Button><br /></>}
                                        {c.confirmationStatus === "NOT_CONFIRMED" &&
                                            <p style={{ fontSize: '12pt' }}>
                                                ⓘ You will be able to finalise event planning after the reservation is confirmed by service provider
                                            </p>
                                        }
                                    </div>
                                </div>}</div>)
                            }
                        </div>
                    }
                    {isServicePicked &&
                        <div>
                            {JSON.parse(window.localStorage.getItem('serviceInfo')).map && JSON.parse(window.localStorage.getItem('serviceInfo')).map(c =>
                                <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1400px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto auto' }} >
                                    <div className='list-item' style={{ width: '1400px' }} onClick={() => history.push(`/ItemDetails/Service/${c.id}`)}>
                                        <div className='overlay-listing' style={{ width: '1400px' }}>
                                            <div className='overlay-listing-left'>
                                                {c.type + " " + c.firstName + " " + c.lastName}<br />
                                                {c.description}
                                            </div>
                                            <div className='overlay-listing-right'>
                                                Service cost: {c.serviceCost} pln<br />
                                            </div>
                                        </div>
                                        <div className='list-item-pics' style={{ width: '1400px' }}>
                                            {c.images && c.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <IconButton onClick={() => handleDeleteService(c)}><DeleteIcon /></IconButton>
                                    <div>
                                        <br />
                                        <TextField size='small' margin='dense' style={{ width: '400px' }} multiline label='Message for service provider' onChange={e => setServiceMessage([...serviceMessage, { 'message': e.target.value, 'id': c.id }])} /><br />
                                        <TextField size='small' margin='dense' InputLabelProps={{ shrink: true }} label='Time from' type='time' onChange={e => setServiceTimeFrom([...serviceTimeFrom, { 'time': e.target.value, 'id': c.id }])} />
                                        {' _ '}
                                        <TextField size='small' margin='dense' InputLabelProps={{ shrink: true }} label='Time to' type='time' onChange={e => setServiceTimeTo([...serviceTimeTo, { 'time': e.target.value, 'id': c.id }])} />
                                    </div>
                                </div>)
                            }
                        </div>
                    }
                    {!isEventReady && <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Services/${id}`)} />}<br />
                    {JSON.parse(window.localStorage.getItem('serviceInfo')) && JSON.parse(window.localStorage.getItem('serviceInfo')).length > 0 &&
                        <Button variant='contained' size='small' margin='dense' className='button' onClick={handleReserveServices}>Request booking</Button>
                    }
                    <p style={{ color: 'red' }}>{serviceErrorMessage}</p>
                </div>
            }

            {isLocPicked && !isNew && locStatus === 'CONFIRMED' && (isFinal() || isEventReady) &&
                <div className='block'>
                    <p className='guest-choice-heading'>Guests</p>
                    {guestList.map(guest =>
                        <div className='guest-list-element' key={guestList.indexOf(guest)}>
                            {guest[isEventReady ? 'firstName' : 'name']} {guest[isEventReady ? 'lastName' : 'surname']} ({guest.email})
                            {!isEventReady && <IconButton onClick={() => handleGuestDelete(guestList.indexOf(guest))}><DeleteIcon /></IconButton>}
                        </div>
                    )}
                    {newGuestPanel &&
                        <div className='new-guest-panel'>
                            <FormControl margin="dense">
                                <InputLabel id="select-guest-label">Pick from guest book</InputLabel>
                                <Select labelId="select-guest-label" size='small' label='Pick from guest book' margin='dense' style={{ width: '300px' }} onChange={handleSelectGuestFromBook}>
                                    {props.authorized && guestBook.map(guest =>
                                        <MenuItem key={guest.id} value={JSON.stringify(guest)}>{guest.firstName + " " + guest.lastName + " (" + guest.email + ')'}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <br />
                            <div>
                                <TextField size='small' margin='dense' style={{ marginRight: '10px' }} className='new-guest-input' id='newGuestName' label='name' onChange={e => setGuestName(e.target.value)} />
                                <TextField size='small' margin='dense' style={{ marginRight: '10px' }} className='new-guest-input' id='newGuestSurname' label='surname' onChange={e => setGuestSurname(e.target.value)} />
                                <TextField size='small' margin='dense' style={{ marginRight: '10px' }} className='new-guest-input' id='newGuestEmail' type='email' label='email' onChange={e => setGuestEmail(e.target.value)} />
                                <Button size='small' margin='dense' style={{ marginTop: '8px' }} variant='contained' className='new-guest-button' onClick={addNewGuest}>Add guest</Button>
                            </div>
                        </div>
                    }
                    {!newGuestPanel && !isEventReady && <input type='button' value='+' className='add-button' onClick={() => setNewGuestPanel(true)} />}
                </div>
            }

            {isLocPicked && isNew &&
                <div className='block' onClick={handleCreateEvent} style={{ textAlign: 'center', cursor: 'pointer' }}>
                    Create event and request location booking <br />
                </div>
            }
            {isFinal() && !isEventReady &&
                <div className='block' onClick={handleEventReady} style={{ textAlign: 'center', cursor: 'pointer' }}>
                    Confirm all bookings and send invitations to guests <br />
                </div>
            }
            {!isFinal() && !isEventReady && isLocPicked && !isNew &&
                "ⓘ You will be able to add guests and finalise the event after everything is confirmed"
            }
        </div>
    )
}