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

    const getAllEvents = () => {
        apiFetch(`events/customer?customerId=${props.userId}&tab=${eventsTab}`)
            .then(result => setItems(result))
            .catch(error => console.log('error', error));
    }

    const [pageNo, setPageNo] = useState('1');
    const [pageSize, setPageSize] = useState('5');
    const [sortBy, setSortBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const getItemsWithFilters = () => {
        let body = {};
        if (location) { body.city = location };
        if (date) { body.date = date }
        if (lowestPriceFilter) { body.minPrice = lowestPriceFilter }
        if (highestPriceFilter) { body.maxPrice = highestPriceFilter }
        switch (typeOfList) {
            default:
                break;
            case 'Venues':
                if (guestNum) { body.guestCount = guestNum }
                if (seatedOnly) { body.isSeated = seatedOnly }
                if (descriptions.length > 0) { body.descriptionItems = descriptions }
                break;
            case 'Caterings':
                if (cuisines.length > 0) { body.cuisines = cuisines }
                break;
            case 'Services':
                if (type) { body.type = type; }
                if (musicStyles.length > 0) { body.musicStyles = musicStyles }
                if (languages.length > 0) { body.languages = languages }
                if (bandPeople) { body.bandPeopleCount = bandPeople }
                if (ageFrom) { body.ageFrom = ageFrom }
                if (ageTo) { body.ageTo = ageTo }
                break;
            case 'Events':
                break;
            // ?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}
        }
        console.log(body);
        apiFetch(`${listType}/allowed/search`, "POST", JSON.stringify(body))
            .then(res => res.json())
            .then(result => { setItems(result) })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        if (listType !== '' && listType !== 'events') {
            if (props.userData && props.userData.user.type === 'B') {
                apiFetch(`${listType}/business?id=${props.userId}`)
                    .then(result => setItems(result))
                    .catch(error => console.log('error', error));
            } else {
                apiFetch(`${listType}/allowed/all`)
                    .then(result => { setItems(result.items) })
                    .catch(error => console.log('error', error));
            }
        } else if (listType === 'events') {
            getAllEvents();
        }
    }, [props.userData, listType])

    //location filters
    const [guestNum, setGuestNum] = useState('');
    const [seatedOnly, setSeatedOnly] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [cities, setCities] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [availableDescriptions, setAvailableDescriptions] = useState([]);
    const [lowestPriceFilter, setLowestPriceFilter] = useState('');
    const [highestPriceFilter, setHighestPriceFilter] = useState('');

    useEffect(() => {
        apiFetch(`locations/allowed/cities`).then(result => setCities(result)).catch(error => console.log('error', error));
        if (typeOfList === "Venues") {
            apiFetch('location_description/allowed/all').then(res => setAvailableDescriptions(res)).catch(e => console.log('error', e));
            try {
                setLocation(JSON.parse(window.sessionStorage.getItem('filters')).location);
                setGuestNum(JSON.parse(window.sessionStorage.getItem('filters')).guestNum);
                setDate(JSON.parse(window.sessionStorage.getItem('filters')).date);
            } catch (e) { }
        } else if (typeOfList === 'Caterings') {
            apiFetch('cuisines/allowed/all').then(res => setAvailableCuisines(res)).catch(e => console.log('error', e))
        } else if (typeOfList === "Services") {
            apiFetch('services/allowed/types').then(res => setAvailableTypes(res)).catch(e => console.log('error', e))
            apiFetch('services/allowed/languages').then(res => setAvailableLanguages(res)).catch(e => console.log('error', e))
            apiFetch('services/allowed/music/styles').then(res => setAvailableMusicStyles(res)).catch(e => console.log('error', e))
        }
    }, [])


    const [eventsTab, setEventsTab] = useState('ALL');
    useEffect(() => {
        if (typeOfList === 'Events') {
            getAllEvents();
        }
    }, [eventsTab])

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

    const handleItemChoice = (id) => {
        if (forEventId === undefined) {
            history.push(`/ItemDetails/${typeOfList.substring(0, typeOfList.length - 1)}/${id}`)
        } else {
            history.push(`/ItemDetails/${typeOfList.substring(0, typeOfList.length - 1)}/${id}/${forEventId}`)
        }
    }

    const handleDescriptions = (e) => {
        let t = new Array(...descriptions);
        if (e.target.checked) {
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
        }
        setDescriptions(t);
    }

    const [cuisines, setCuisines] = useState([]);
    const [availableCuisines, setAvailableCuisines] = useState([]);
    const handleCuisines = (e) => {
        let t = new Array(...cuisines);
        if (e.target.checked) {
            t.push( e.target.value );
        } else {
            t.splice(t.indexOf(e.target.value ), 1);
        }
        setCuisines(t);
    }


    const [musicStyles, setMusicStyles] = useState([]);
    const [availableMusicStyles, setAvailableMusicStyles] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [type, setType] = useState('');
    const [availableTypes, setAvailableTypes] = useState([]);
    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [bandPeople, setBandPeople] = useState('');
    const handleMusicStyles = (e) => {
        let t = new Array(...musicStyles);
        if (e.target.checked) {
            t.push(e.target.value );
        } else {
            t.splice(t.indexOf(e.target.value ), 1);
        }
        setMusicStyles(t);
    }

    const handleLanguages = (e) => {
        let t = new Array(...languages);
        if (e.target.checked) {
            t.push(e.target.value );
        } else {
            t.splice(t.indexOf(e.target.value ), 1);
        }
        setLanguages(t);
    }

    const handleSorting = (e) => {
        switch (e.target.value) {
            default:
                setSortBy('id');
                setOrder('asc');
                break;
            case "priceLow":
                setSortBy();
                setOrder('asc');
                break;
            case "priceHigh":
                setSortBy();
                setOrder('asc');
                break;
            case "ratingHigh":
                setSortBy('rating');
                setOrder('desc');
                break;
            case "ratingLow":
                setSortBy('rating');
                setOrder('asc');
                break;
        }
        getItemsWithFilters();
    }

    return (
        <div className="main">
            {(props.authorized === false || (props.authorized === true && props.userData.user.type === 'C')) && <>
                {typeOfList !== "Events" &&
                    <div className="block">
                        City:
                        <select name="City" id="city-select" className='input' onChange={e => setLocation(e.target.value)}>
                            <option value=" ">{location !== '' && location}</option>
                            {cities.map(c => <option value={c} key={c}>{c}</option>)}
                        </select>
                        <br />
                        <div className="guests-choice">
                            {typeOfList === "Venues" && <>Number of guests:
                                <input type="number" className='venue-input-number' defaultValue={guestNum} onChange={e => setGuestNum(e.target.value)} />
                                <input type="checkbox" className='venue-input-seat' onChange={e => setSeatedOnly(e.target.value === 'on')} />
                                Seated only<br />
                                Daily rent</>}{typeOfList !== "Venues" && "Service"} price <input className='venue-input-number' type="number" onChange={e => setLowestPriceFilter(e.target.value)} /> -<input className='venue-input-number' type="number" onChange={e => setHighestPriceFilter(e.target.value)} />

                        </div>

                        <div className="event-date">
                            Date:
                            <input defaultValue={date} type="date" className='venue-input-date' />
                        </div>
                        {typeOfList === "Services" &&
                            <>
                                Type
                                <select className="input" onChange={e => setType(e.target.value)}>
                                    <option value=''>choose</option>
                                    {availableTypes.map(t =>
                                        <option key={t} value={t}>{t}</option>
                                    )}
                                </select><br />
                                {type === 'KIDS PERFORMER' &&
                                    <div>
                                        Age
                                        <input className="input" onChange={e => setAgeFrom(e.target.value)} />
                                        to
                                        <input className="input" onChange={e => setAgeTo(e.target.value)} /><br />
                                    </div>
                                }
                                {type === "INTERPRETER" &&
                                    <div>
                                        {availableLanguages.map(o => <div key={o}><input type='checkbox' value={o} onChange={handleLanguages} /> {o}</div>)}
                                    </div>
                                }
                                {type === 'MUSIC BAND' &&
                                    <div>
                                        Number of people
                                        <input className="input" onChange={e => setBandPeople(e.target.value)} /><br />
                                    </div>
                                }
                                {(type === 'SINGER' || type === "DJ" || type === 'MUSICIAN' || type === 'MUSIC BAND') &&
                                    <div>
                                        {availableMusicStyles.map(o => <div key={o}><input type='checkbox' value={o} onChange={handleMusicStyles} /> {o}</div>)}
                                    </div>
                                }
                            </>
                        }
                        {typeOfList === "Venues" &&
                            <>
                                Must have:
                                <br />
                                <div className="must-haves">
                                    {availableDescriptions.map(d => <div key={d}>
                                        <input type='checkbox' value={d} onChange={handleDescriptions} /> {d}
                                    </div>)}
                                </div>
                            </>
                        }
                        {typeOfList === 'Caterings' &&
                            <>
                                Cuisisnes:
                                <br />
                                <div className="must-haves">
                                    {availableCuisines.map(d => <div key={d.name}>
                                        <input type='checkbox' value={d.name} onChange={handleCuisines} /> {d.name}
                                    </div>)}
                                </div>
                            </>
                        }
                        <input type='button' className='button' value='Apply filters' onClick={getItemsWithFilters} />
                    </div>
                }
            </>}
            <div className='list-sorting-rect'>
                <p className='list-displaying-info'>Displaying 1-{pageSize} results out of {items && items.length}</p>
                <div className='select-list-sorting'>
                    Sort by:
                    <select className='select-list-sorting' onChange={handleSorting}>
                        <option value='default'>Deafault</option>
                        <option value='priceLow'>Price: lowest first</option>
                        <option value='priceHigh'>Price: highest first</option>
                        <option value='ratingLow'>Rating: lowest first</option>
                        <option value='ratingHigh'>Rating: highest first</option>
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
                            {c.images && c.images.map(i => <div key={i.encodedImage}>
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