/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import '../../styles/customer/ListPage.css'

import pplIcon from '../../images/pplIcon.png';
import apiFetch from "../../api";


export default function ListPage(props) {
    const { typeOfList } = useParams();
    const { forEventId } = useParams();

    const [listType, setListType] = useState('');
    useEffect(() => {
        if (typeOfList === 'Venues') {
            setListType('locations')
        } else if (typeOfList === 'Services') {
            setListType('services')
        } else if (typeOfList === 'Caterings') {
            setListType('caterings')
        } else if (typeOfList === 'Events') {
            setListType('events')
        }
    }, [])

    useEffect(() => { props.setHeaderMessage(typeOfList) }, []);

    const history = useHistory();

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (listType !== '' && listType !== 'events') {
            if (props.userData && props.userData.user.type === 'B') {
                apiFetch(`${listType}/business?id=${props.userId}`)
                    .then(result => setItems(result))
                    .catch(error => console.log('error', error));
            } else {
                apiFetch(`${listType}/allowed/all`)
                .then(result => {setItems(result.items)})
                .catch(error => console.log('error', error));
            }
        } else if (listType === 'events') {
            getAllEvents();
        }
    }, [props.userData, listType])

    //location filters
    const [guestNum, setGuestNum] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (typeOfList === "Venues") {
            apiFetch(`locations/allowed/cities`)
                .then(result => setCities(result))
                .catch(error => console.log('error', error));

            try {
                setLocation(JSON.parse(window.sessionStorage.getItem('filters')).location);
                setGuestNum(JSON.parse(window.sessionStorage.getItem('filters')).guestNum);
                setDate(JSON.parse(window.sessionStorage.getItem('filters')).date);
            } catch (e) { }
        }
    }, [])


    const [eventsTab, setEventsTab] = useState('ALL');
    useEffect(() => {
        if(typeOfList === 'Events'){
            getAllEvents();
        }
        // eslint-disable-next-line
    }, [eventsTab])
    const getAllEvents = () => {
        apiFetch(`events/customer?customerId=${props.userId}&tab=${eventsTab}`)
            .then(result => setItems(result))
            .catch(error => console.log('error', error));
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

    const handleItemChoice = (id) =>{
        if(forEventId === undefined){
            history.push(`/ItemDetails/${typeOfList.substring(0, typeOfList.length - 1)}/${id}`)
        }else{
            history.push(`/ItemDetails/${typeOfList.substring(0, typeOfList.length - 1)}/${id}/${forEventId}`)
        }
    }

    return (
        <div className="main">
            {(props.authorized === false || (props.authorized === true && props.userData.user.type === 'C')) && <>
                {typeOfList === "Venues" &&
                    <div className="block">
                        City:
                        <select name="City" id="city-select" className='input' >
                            <option value=" ">{location !== '' && location}</option>
                            {cities.map(c => <option value={c} key={c}>{c}</option>)}
                        </select>
                        <br />
                        <div className="guests-choice">
                            Number of guests:
                            <input type="text" className='venue-input-number' defaultValue={guestNum} contentEditable />
                            <input type="checkbox" className='venue-input-seat' />
                            Seated
                            <input type="checkbox" className='venue-input-seat' />
                            Standing
                        </div>

                        <div className="event-date">
                            Date:
                            <input defaultValue={date} type="date" className='venue-input-date' />
                        </div>
                        Must have:
                        <br />
                        <div className="must-haves">
                            <div>
                                <input className='venue-input-musts' id="wifi" type="checkbox"></input>Wi-Fi
                            </div><div>
                                <input className='venue-input-musts' id="stage" type="checkbox"></input>Stage
                            </div><div>
                                <input className='venue-input-musts' id="alcohol" type="checkbox"></input>Serves alcohol
                            </div><div>
                                <input className='venue-input-musts' id="own-alcohol" type="checkbox"></input>Can bring own alcohol
                            </div><div>
                                <input className='venue-input-musts' id="otside-catering" type="checkbox"></input>Outside catering
                            </div><div>
                                <input className='venue-input-musts' id="wheelchair-accessible" type="checkbox"></input>Wheelchair accessible
                            </div><div>
                                <input className='venue-input-musts' id="outside-patio" type="checkbox"></input>Outside patio
                            </div><div>
                                <input className='venue-input-musts' id="food" type="checkbox"></input>Serves food
                            </div><div>
                                <input className='venue-input-musts' id="own-food" type="checkbox"></input>Can bring own food
                            </div>
                        </div>
                        <input type='button' className='button' value='Apply filters' />
                    </div>
                }
                {typeOfList === "Services" && <div className="block">Services filters</div>}
                {typeOfList === "Caterings" && <div className="block">Caterings filters</div>}
            </>}
            <div className='list-sorting-rect'>
                <p className='list-displaying-info'>Displaying 1-20 results out of 50</p>
                <div className='select-list-sorting'>
                    Sort by:
                    <select className='select-list-sorting'>
                        <option value='default'>Deafault</option>
                        <option value='priceLow'>Price: lowest first</option>
                        <option value='priceHigh'>Price: highest first</option>
                        <option value='priceHigh'>Rating: lowest first</option>
                        <option value='priceHigh'>Rating: highest first</option>
                    </select>
                </div>
            </div>
            {listType === "events" &&
                <div className='block' style={{ textAlign: 'center' }}>
                    <input type='button' className='e-c-button-l' value='past' onClick={handleEvents} style={{ color: eventPastColor, backgroundColor: eventPastBackColor }} />
                    <input type='button' className='e-c-button-c' value='all' onClick={handleEvents} style={{ color: eventAllColor, backgroundColor: eventAllBackColor }} />
                    <input type='button' className='e-c-button-r' value='future' onClick={handleEvents} style={{ color: eventFutureColor, backgroundColor: eventFutureBackColor }} />
                </div>
            }
            {items.length > 0 && (items[0].address || listType === 'services' || listType === 'events') && <>
                {items.map(c => <div key={c.id} className='list-element' onClick={() => handleItemChoice(c.id)}>
                    <div className='list-item' >
                        <div className='overlay-listing' >
                            <div className='overlay-listing-left'>
                                {typeOfList === 'Events' && <>
                                    {c.name}<br />
                                    {c.date}, {c.startTime}{c.endTime !== c.startTime && '- ' + c.endTime}
                                </>}
                                {typeOfList === "Services" && <>
                                    {c.type + " " + c.firstName + " " + c.lastName}<br />
                                </>}
                                {typeOfList === "Caterings" && <>
                                    {c.name}<br />
                                </>}
                                {typeOfList === "Venues" && <>
                                    {c.name} , {c.address.city}, {c.address.streetName}, {c.address.streetNumber}<br />
                                </>}
                                {c.description}
                                {typeOfList === "Venues" && <>
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                    {c.seatingCapacity}
                                </>}
                            </div>
                            <div className='overlay-listing-right'>
                                {typeOfList === 'Events' && <>
                                    {c.eventType}<br />
                                    {c.guestCount} people
                                </>}
                                {typeOfList === "Services" && <>
                                    Service cost: {c.serviceCost} pln<br />
                                </>}
                                {typeOfList === "Caterings" && <>
                                    Service cost: {c.serviceCost} pln<br />
                                </>}
                                {typeOfList === "Venues" && <>
                                    From {c.dailyRentCost}pln/day
                                </>}

                            </div>
                        </div>
                        <div className='list-item-pics'>
                            {typeOfList === "Venues" && c.images.map(i => <div key={i.encodedImage}>
                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                            </div>)}
                        </div>
                    </div>
                </div>)}
            </>}


            {props.authorized === true && props.userData.user.type === 'B' &&
                <div className='block' style={{ textAlign: 'center' }} onClick={() => history.push('/AddBusinessPage/' + typeOfList.substring(0, typeOfList.length - 1))}>
                    Add {typeOfList.substring(0, typeOfList.length - 1)}
                </div>
            }
            {props.authorized === true && props.userData.user.type === 'C' && typeOfList === 'Events' &&
                <div className='block' style={{ textAlign: 'center' }} onClick={() => history.push('/EventDetailsPage/new')}>
                    Add {typeOfList.substring(0, typeOfList.length - 1)}
                </div>
            }
        </div>)
}