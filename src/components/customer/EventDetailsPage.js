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
            setIsNew(false);
        }
        return () => {
            if (!isNew) {
                window.localStorage.setItem('locationDetails', null);
                window.localStorage.setItem('eStart', null);
                window.localStorage.setItem('eEnd', null);
                window.sessionStorage.setItem('filters', JSON.stringify({ "guestNum": null, "date": null, "eventType": null }));
                window.localStorage.setItem('eventName', null);
            }
        };
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
    useEffect(() => {
        if (!isNew) {
            apiFetch(`events/detail?eventId=${id}&customerId=${props.userId}`).then(res => {
                props.setHeaderMessage(res.name);
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
        if (guestList.length > 0) {
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
        setGuestList(temp);
        if (temp.length === 0) {
            props.setGuests([]);
        }
    }

    const inviteGuests = () => {
        let body = [];
        guestList.forEach(g => body.push(g.id));
        apiFetch(`customers/guests/invite?customerId=${props.userId}&eventId=${id}&guestIds=${JSON.stringify(body).substring(1, JSON.stringify(body).length - 1)}`, 'PUT')
            .catch(e => console.log('error', e))
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
        inviteGuests();
        apiFetch(`customers/invite/send?id=${props.userId}&eventId=${id}`, "POST").then(res => { if (res.ok) { console.log('created') } }).catch(e => console.log('error', e));

    }

    const isFinal = () => {
        let catStatus = true;
        let serStatus = true;
        bookedCats.forEach(e => {
            if (e.confirmationStatus === "NOT_CONFIRMED") {
                catStatus = false;
            }
        })
        bookedServices.forEach(e => {
            if (e.confirmationStatus === "NOT_CONFIRMED") {
                serStatus = false;
            }
        })
        if (locStatus === "CONFIRMED" && catStatus && serStatus) {
            return true;
        } else {
            return false;
        }
    }

    const [locationCancellationMessage, setLocationCancellationMessage] = useState('');
    const handleCancel = (type, id) => {
        apiFetch(`event/${type}/cancel?id=${id}`, "DELETE").then(res => res.json()).then(res => { console.log(res); window.localStorage.setItem('locationDetails', null); window.location.reload() })
            .catch(e => { console.log('error', e); setLocationCancellationMessage('You have to cancel caterings and services first') })
    }

    const bookVenue = () => {
        console.log(JSON.parse(window.localStorage.getItem('locationDetails')).id);
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
    }

    const cancelEvent = () => {
        apiFetch(`events/cancel?id=${id}`, "DELETE").then(() => history.push('/ListPage/Events')).catch(e => console.log('error' + e));
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
                </select><br />
                {!isNew && <input type='button' className='button' onClick={cancelEvent} value='Cancel event' />}
                {formError && <p style={{ color: 'red', textAlign: 'center' }}><br />Please fill in all the fields</p>}
            </div>
            <div className='block'>
                <p className='venue-choice-heading'>
                    Venue
                    {isLocPicked && isNew && <input type='button' value='x' style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} onClick={() => {
                        window.localStorage.setItem('locationDetails', null);
                        setIsLocPicked(false);
                    }} />}
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
                    <p className='venue-choice-heading'>{locStatus !== '' && <>Status: {locStatus}</>}<br />
                        {(locStatus === 'CONFIRMED' || locStatus === 'NOT_CONFIRMED') && <button className='button' onClick={() => handleCancel('location', locResId)}>
                            Cancel request
                        </button>}<br />
                        <p style={{ color: 'red' }}>{locationCancellationMessage}</p>
                        {(locStatus === '') && <button className='button' onClick={() => bookVenue('location', locResId)}>
                            Book venue
                        </button>}<br />
                        {locStatus === '' &&
                            <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Venues/${id}`)} />
                        }
                        {locStatus === 'NOT_CONFIRMED' && 'ⓘ You will be able to pick caterigs, services, and invite guests to your event after the reservation is confirmed by venue provider'}
                    </p>
                }
                {(!isLocPicked || JSON.parse(window.localStorage.getItem('locationDetails')) === null) &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Venues/${id}`)} />
                }
            </div>
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
                                        Message for catering provider: <br />
                                        "{c.comment}"<br />
                                        Serving time: {c.time}<br />
                                        Status: {c.confirmationStatus}<br />
                                        <button className='button' onClick={() => handleCancel('catering', c.id)}>
                                            Cancel request
                                        </button><br />
                                        {c.confirmationStatus === "NOT_CONFIRMED" && 'ⓘ You will be able to make an order after the reservation is confirmed by catering provider'}
                                        {c.confirmationStatus === "CONFIRMED" && c.order.length === 0 && !menuEditing.value && <input type='button' className='button' value='Make order' onClick={() => setMenuEditing({ 'value': true, 'id': c.id })} />}
                                        {c.order.length > 0 && "Order status:"}<br />
                                        {c.order.length > 0 && 'Order:'}
                                        {c.order.length > 0 && c.order.map(item => <li key={item.id}>{item.amount}/{item.item.name}</li>)}
                                        {menuEditing.value && menuEditing.id === c.id &&
                                            <div>
                                                {cateringItemTypes[c.catering.id] && <p className='item-review-heading'>Menu</p>}
                                                {cateringItemTypes[c.catering.id] && cateringItemTypes[c.catering.id].map(t => <div key={t}>
                                                    <p className='item-info-heading'>{t}s</p>
                                                    {c.catering.cateringItems.filter(l => l.type === t).map(item => <div className="catering-menu-item" key={item.id}>
                                                        <div className="menu-item-left">{item.name}<br />
                                                            {item.description}<br />
                                                        </div>
                                                        <div className="menu-item-right">{item.servingPrice} Quantity:
                                                            <input type='number' style={{ width: '100px' }} onChange={e => handleOrderEdit(c.id, item.id, e.target.value)} />
                                                            <br />
                                                            {Object.keys(item).filter(k => item[k] === true).map(i => '"' + i + '" ')}<br />
                                                        </div>
                                                    </div>)}
                                                </div>)}
                                                {!cateringItemTypes[c.catering.id] && <>
                                                    Leave your order here<br />
                                                    <textarea /><br />
                                                </>}
                                                <input type='button' className='button' value='Confirm order' onClick={() => { setMenuEditing({ 'value': false, 'id': c.id }); handleOrderSubmit(c.id) }} />
                                                <input type='button' className='button' value='Cancel' onClick={() => setMenuEditing({ 'value': false, 'id': c.id })} />
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
                                        <div className='' style={{ width: '1420px' }}>
                                            {c.images && c.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <input type='button' value='x' className='x-button' onClick={() => handleDeleteCatering(c)} />
                                    <div>
                                        Message for catering provider <br />
                                        <textarea onChange={e => setCaterMessage([...caterMessage, { 'message': e.target.value, 'id': c.id }])} /><br />
                                        Serving time
                                        <input type='time' onChange={e => setCaterTime([...caterTime, { 'time': e.target.value, 'id': c.id }])} />
                                    </div>
                                </div>)}
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Caterings/${id}`)} /><br />
                    {JSON.parse(window.localStorage.getItem('cateringInfo')) && JSON.parse(window.localStorage.getItem('cateringInfo')).length > 0 && <input type='button' value='Request caterings booking' className='button' onClick={handleReserveCaterings} />}
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
                                        <div className='list-item-pics'>
                                            {c.optionalService.images && c.optionalService.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <div>
                                        Message for catering provider: <br />
                                        "{c.comment}"<br />
                                        Time: {c.timeFrom} - {c.timeTo}<br />
                                        Status: {c.confirmationStatus}<br />
                                        <button className='button' onClick={() => handleCancel('service', c.id)}>
                                            Cancel request
                                        </button><br />
                                        {c.confirmationStatus === "NOT_CONFIRMED" && 'ⓘ You will be able to finalise event planning after the reservation is confirmed by service provider'}
                                    </div>
                                </div>}</div>)
                            }
                        </div>
                    }
                    {isServicePicked &&
                        <div>
                            {JSON.parse(window.localStorage.getItem('serviceInfo')).map && JSON.parse(window.localStorage.getItem('serviceInfo')).map(c =>
                                <div key={c.id} className='item-list-element' style={{ justifySelf: 'center', width: '1420px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'auto auto' }} >
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
                                            {c.images && c.images.map(i => <div key={i.encodedImage}>
                                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                                            </div>)}
                                        </div>
                                    </div>
                                    <input type='button' value='x' className='x-button' onClick={() => handleDeleteService(c)} />
                                    <div>
                                        Message for service provider <br />
                                        <textarea onChange={e => setServiceMessage([...serviceMessage, { 'message': e.target.value, 'id': c.id }])} /><br />
                                        Time: <input type='time' onChange={e => setServiceTimeFrom([...serviceTimeFrom, { 'time': e.target.value, 'id': c.id }])} />
                                        {' - '}
                                        <input type='time' onChange={e => setServiceTimeTo([...serviceTimeTo, { 'time': e.target.value, 'id': c.id }])} />
                                    </div>
                                </div>)
                            }
                        </div>
                    }
                    <input type='button' value='+' className='add-button' onClick={() => history.push(`/ListPage/Services/${id}`)} /><br />
                    {JSON.parse(window.localStorage.getItem('serviceInfo')) && JSON.parse(window.localStorage.getItem('serviceInfo')).length > 0 && <input type='button' value='Request services booking' className='button' onClick={handleReserveServices} />}
                    <p style={{ color: 'red' }}>{serviceErrorMessage}</p>
                </div>
            }

            {isLocPicked && !isNew && locStatus === 'CONFIRMED' &&
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
            {isFinal() &&
                <div className='block' onClick={handleEventReady} style={{ textAlign: 'center', cursor: 'pointer' }}>
                    Confirm all bookings and send invitations to guests <br />
                </div>
            }
        </div>
    )
}