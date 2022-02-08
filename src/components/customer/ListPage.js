/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import '../../styles/customer/ListPage.css'
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import addEvent from '../../images/add event.png';

import pplIcon from '../../images/pplIcon.png';
import apiFetch from "../../api";

import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox, InputAdornment, Pagination, Skeleton, Tooltip } from '@mui/material'



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
            .then(result => { setItems(result); setIsLoading(false) })
            .catch(error => console.log('error', error));
    }

    const [pageNo, setPageNo] = useState('');
    const [pageSize, setPageSize] = useState('');
    const [totalRes, setTotalRes] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');
    const getItemsWithFilters = (sorting) => {
        setIsLoading(true);
        let body = {};
        let forLocationId = '';
        if (forEventId) {
            setDate(JSON.parse(window.sessionStorage.filters).date);
            body.date = JSON.parse(window.sessionStorage.filters).date;

            setLocation(JSON.parse(window.sessionStorage.filters).location);
            body.city = JSON.parse(window.sessionStorage.filters).location;

            if (listType === 'caterings') {
                forLocationId = '?locationId=' + JSON.parse(window.localStorage.getItem('locationDetails')).id;
            }

        } else {
            if (location) { body.city = location };
            if (date) { body.date = date }
        }
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
        }
        apiFetch(`${listType}/allowed/search${forLocationId}`, "POST", JSON.stringify(body))
            .then(res => res.json())
            .then(result => {
                if (sorting) {
                    switch (sorting) {
                        default:
                            result.items.sort((e, a) => e.id - a.id);
                            break;
                        case "priceLow":
                            result.items.sort((e, a) => e[typeOfList === 'Venues' ? "dailyRentCost" : 'serviceCost'] - a[typeOfList === 'Venues' ? "dailyRentCost" : 'serviceCost']);
                            break;
                        case "priceHigh":
                            result.items.sort((e, a) => a[typeOfList === 'Venues' ? "dailyRentCost" : 'serviceCost'] - e[typeOfList === 'Venues' ? "dailyRentCost" : 'serviceCost']);
                            break;
                        case "ratingHigh":
                            result.items.sort((e, a) => e.rating > a.rating);
                            break;
                        case "ratingLow":
                            result.items.sort((e, a) => e.rating > a.rating);
                            break;
                    }
                }

                setItems(result.items);
                setIsLoading(false);
                setTotalRes(result.meta.total);
                setPageSize(null);
            })
            .catch(error => console.log('error', error));
    }

    const getList = () => {
        if (props.userData && props.userData.user.type === 'B') {
            apiFetch(`${listType}/business?id=${props.userId}`)
                .then(result => { setItems(result); setIsLoading(false); })
                .catch(error => console.log('error', error));
        } else {
            apiFetch(`${listType}/allowed/all?sortBy=${sortBy === "" ? 'id' : sortBy}&order=${order === '' ? 'acs' : order}&pageNo=${pageNo === '' ? 0 : pageNo}&pageSize=${pageSize === '' ? 5 : pageSize}`)
                .then(result => {
                    setItems(result.items);
                    setIsLoading(false);
                    setPageSize(result.meta.pageSize);
                    setTotalRes(result.meta.total);
                    setPageNo(result.meta.pageNo);
                    setSortBy(result.meta.sortBy);
                })
                .catch(error => console.log('error', error));
        }
    }

    useEffect(() => {
        if (listType !== '' && listType !== 'events') {
            if (forEventId) {
                getItemsWithFilters();
            } else {
                getList();
            }
        } else if (listType === 'events') {
            getAllEvents();
        }
    }, [props.userData, listType, pageNo, sortBy, order])

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


    const [eventsTab, setEventsTab] = useState('CURRENT');
    useEffect(() => {
        if (typeOfList === 'Events') {
            getAllEvents();
        }
    }, [eventsTab])

    const [eventPastColor, setEventPastColor] = useState('#47525e');
    const [eventFutureColor, setEventFutureColor] = useState('white');
    const [eventAllColor, setEventAllColor] = useState('#47525e');
    const [eventPastBackColor, setEventPastBackColor] = useState('#F2F4F5');
    const [eventFutureBackColor, setEventFutureBackColor] = useState('#47525e');
    const [eventAllBackColor, setEventAllBackrColor] = useState('#F2F4F5');
    const handleEvents = (e) => {
        if (e.target.value === "all") {
            setEventPastColor('#47525e');
            setEventFutureColor('#47525e');
            setEventAllColor('white');
            setEventPastBackColor('#F2F4F5');
            setEventFutureBackColor('#F2F4F5');
            setEventAllBackrColor('#47525e');
            setEventsTab('ALL')
        } else if (e.target.value === "past") {
            setEventPastColor('white');
            setEventFutureColor('#47525e');
            setEventAllColor('#47525e');
            setEventPastBackColor('#47525e');
            setEventFutureBackColor('#F2F4F5');
            setEventAllBackrColor("#F2F4F5");
            setEventsTab('PAST')
        } else if (e.target.value === "future") {
            setEventPastColor('#47525e');
            setEventFutureColor('white');
            setEventAllColor('#47525e');
            setEventPastBackColor('#F2F4F5');
            setEventFutureBackColor('#47525e');
            setEventAllBackrColor('#F2F4F5');
            setEventsTab('CURRENT')
        }
    }

    const handleItemChoice = (id) => {
        if (typeOfList === 'Events') {
            history.push(`/EventDetailsPage/${id}`)
        } else if (forEventId === undefined) {
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
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
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
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
        }
        setMusicStyles(t);
    }

    const handleLanguages = (e) => {
        let t = new Array(...languages);
        if (e.target.checked) {
            t.push(e.target.value);
        } else {
            t.splice(t.indexOf(e.target.value), 1);
        }
        setLanguages(t);
    }

    const handleSorting = (e) => {
        if (pageSize === null) {
            getItemsWithFilters(e.target.value);
        } else {
            switch (e.target.value) {
                default:
                    setSortBy('id');
                    setOrder('asc');
                    break;
                case "priceLow":
                    setSortBy(typeOfList === "Venues" ? 'dailyRentCost' : 'serviceCost');
                    setOrder('asc');
                    break;
                case "priceHigh":
                    setSortBy(typeOfList === "Venues" ? 'dailyRentCost' : 'serviceCost');
                    setOrder('desc');
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
        }
    }

    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="main">
            {(props.authorized === false || (props.authorized === true && props.userData.user.type === 'C')) && <>
                {typeOfList !== "Events" &&
                    <div className="block">
                        <FormControl margin="dense">
                            <InputLabel id="select-city-label">City</InputLabel>
                            <Select labelId="select-city-label" value={location} style={{ width: '200px' }} size="small" label="City" onChange={e => setLocation(e.target.value)}>
                                {cities.map(c => <MenuItem value={c} key={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <br />
                        <div className="guests-choice">
                            {typeOfList === "Venues" && <>
                                <TextField type="number" label="Guests" size='small' margin="dense" InputLabelProps={{ shrink: true }} style={{ width: '200px' }} value={guestNum} onChange={e => setGuestNum(e.target.value)} />{'  '}
                                <FormControlLabel margin="dense" control={<Checkbox onChange={e => setSeatedOnly(e.target.checked)} />} label={'Seated only'} /><br /></>
                            }
                            <TextField size="small" margin="dense" InputLabelProps={{ shrink: true }} InputProps={{
                                startAdornment:
                                    <InputAdornment position="start">
                                        zł
                                    </InputAdornment>
                            }} className='venue-input-number' label='From' type="number" onChange={e => setLowestPriceFilter(e.target.value)} /> _ <TextField margin="dense" size="small" InputLabelProps={{ shrink: true }} InputProps={{
                                startAdornment:
                                    <InputAdornment position="start">
                                        zł
                                    </InputAdornment>
                            }} label='To' className='venue-input-number' type="number" onChange={e => setHighestPriceFilter(e.target.value)} />
                        </div>

                        <div className="event-date">
                            <TextField value={date} InputLabelProps={{ shrink: true }} label='Date' type="date" style={{ width: '200px' }} size='small' onChange={e => setDate(e.target.value)} />
                        </div>
                        {typeOfList === "Services" &&
                            <>
                                <FormControl margin='dense'>
                                    <InputLabel id="select-type-label">Type</InputLabel>
                                    <Select style={{ width: '200px' }} size="small" label='type' onChange={e => setType(e.target.value)}>
                                        <MenuItem value=''>choose</MenuItem>
                                        {availableTypes.map(t =>
                                            <MenuItem key={t} value={t}>{t}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>


                                <br />
                                {type === 'KIDS PERFORMER' &&
                                    <div>
                                        <TextField label='Age from' margin="dense" size='small' onChange={e => setAgeFrom(e.target.value)} />{' _ '}
                                        <TextField label='Age to' margin="dense" size='small' onChange={e => setAgeTo(e.target.value)} /><br />
                                    </div>
                                }
                                {type === "INTERPRETER" &&
                                    <div>
                                        {availableLanguages.map(o => <div key={o}><FormControlLabel control={<Checkbox value={o} onChange={handleLanguages} />} label={o} /></div>)}
                                    </div>
                                }
                                {type === 'MUSIC BAND' &&
                                    <div>
                                        <TextField label='Number of people' margin="dense" size='small' type='number' className="input" onChange={e => setBandPeople(e.target.value)} /><br />
                                    </div>
                                }
                                {(type === 'SINGER' || type === "DJ" || type === 'MUSICIAN' || type === 'MUSIC BAND') &&
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                                        {availableMusicStyles.map(o => <div key={o}><FormControlLabel control={<Checkbox value={o} onChange={handleMusicStyles} />} label={o} /></div>)}
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
                                        <FormControlLabel control={<Checkbox value={d} onChange={handleDescriptions} />} label={d} />
                                    </div>)}
                                </div>
                            </>
                        }
                        {typeOfList === 'Caterings' &&
                            <>
                                Cuisines (inclusive):
                                <br />
                                <div className="must-haves" style={{ gridTemplateColumns: 'auto auto auto' }}>
                                    {availableCuisines.map(d => <div key={d.name}>
                                        <FormControlLabel control={<Checkbox value={d.name} onChange={handleCuisines} />} label={d.name} />
                                    </div>)}
                                </div>
                            </>
                        }
                        <br />
                        <Button type='button' margin='dense' variant="contained" className='button' value='Apply filters' onClick={getItemsWithFilters}>Apply filters</Button>
                    </div>
                }
            </>}
            {listType !== "events" && (props.authorized === false || (props.authorized === true && props.userData.user.type !== 'B')) && <div className='list-sorting-rect'>
                <p className='list-displaying-info'>{pageSize !== null ? `Displaying ${1 + pageNo * pageSize}-${(pageNo + 1) * pageSize > totalRes ? totalRes : (pageNo + 1) * pageSize} results out of` : 'Found results: '} {totalRes}</p>
                {pageSize !== null ? <Pagination style={{ justifySelf: 'center' }} count={Math.ceil(totalRes / pageSize)} page={pageNo + 1} onChange={(event, value) => { setPageNo(value - 1); console.log(value) }} shape='rounded' /> : <div> </div>}
                <div className='select-list-sorting'>
                    <FormControl>
                        <InputLabel id="select-sorting-label">Sort by</InputLabel>
                        <Select labelId="select-sorting-label" label='Sort by' className='input' onChange={handleSorting}>
                            <MenuItem value='default' >Default</MenuItem>
                            <MenuItem value='priceLow'>Price: lowest first</MenuItem>
                            <MenuItem value='priceHigh'>Price: highest first</MenuItem>
                            <MenuItem value='ratingLow'>Rating: lowest first</MenuItem>
                            <MenuItem value='ratingHigh'>Rating: highest first</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>}
            {props.authorized === true && props.userData.user.type === 'B' && props.userData.verificationStatus === "VERIFIED" &&
                <div className='block' style={{ textAlign: 'center'}} >
                    <Button variant='outlined' size='medium' onClick={() => history.push('/AddBusinessPage/' + typeOfList.substring(0, typeOfList.length - 1))}>
                    Add new +
                    </Button>
                </div>
            }
            {listType === "events" &&
                <>
                    <div className='block' style={{ textAlign: 'center' }}>
                        <Button type='button' className='e-c-button-l' value='past' onClick={handleEvents} style={{ color: eventPastColor, backgroundColor: eventPastBackColor }}>past</Button>
                        <Button type='button' className='e-c-button-r' value='future' onClick={handleEvents} style={{ color: eventFutureColor, backgroundColor: eventFutureBackColor }}>future</Button>
                        <Button type='button' className='e-c-button-c' value='all' onClick={handleEvents} style={{ color: eventAllColor, backgroundColor: eventAllBackColor }}>all</Button>
                    </div>
                    {props.authorized === true && props.userData.user.type === 'C' && typeOfList === 'Events' &&
                        <Tooltip title={'Create ' + typeOfList.substring(0, typeOfList.length - 1)}>
                            <img
                                style={{
                                    cursor: 'pointer',
                                    height: '50px',
                                    position: 'relative',
                                    top: '-110px',
                                    left: '700px'
                                }}
                                onClick={() => {
                                    window.localStorage.removeItem('locationDetails');
                                    window.localStorage.removeItem('eStart');
                                    window.localStorage.removeItem('eEnd');
                                    window.sessionStorage.setItem('filters', JSON.stringify({ "guestNum": '', "date": '', "eventType": '' }));
                                    window.localStorage.removeItem('eventName');
                                    history.push('/EventDetailsPage/new');
                                }} alt='add-event' src={addEvent} />
                        </Tooltip>
                    }
                </>

            }
            {isLoading &&
                <Skeleton variant='rectangular' width={1520} height={400}></Skeleton>
            }
            {items.length > 0 && (items[0].address || listType === 'services' || listType === 'events') && !isLoading && <>
                {items.map(c => <div key={c.id} className='list-element' onClick={() => handleItemChoice(c.id)}>
                    <div className='list-item' >
                        <div className='overlay-listing' >
                            <div className='overlay-listing-left'>
                                {typeOfList === 'Events' && <>
                                    {c.name} <br />
                                    {c.date}, {c.startTime}{c.endTime !== c.startTime && '- ' + c.endTime}
                                </>}
                                {typeOfList === "Services" && <>
                                    {c.type + " " + c.firstName + " " + c.lastName}<br />
                                </>}
                                {typeOfList === "Caterings" && <>
                                    {c.name}<br />
                                </>}
                                {typeOfList === "Venues" && <>
                                    {c.name} {('★').repeat(c.rating)} <br />
                                </>}
                                <div style={{ fontSize: '14pt', width: '800px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {c.description}
                                </div>
                            </div>
                            <div className='overlay-listing-right'>
                                {typeOfList === 'Events' && <>
                                    {c.eventType}<br />
                                    {c.guestCount} people
                                </>}
                                {typeOfList === "Services" && <>
                                    Service cost: {c.serviceCost} pln<br />
                                    {('★').repeat(c.rating)}
                                </>}
                                {typeOfList === "Caterings" && <>
                                    Service cost: {c.serviceCost} pln<br />
                                    {('★').repeat(c.rating)}
                                </>}
                                {typeOfList === "Venues" && <>
                                    From {c.dailyRentCost}pln/day<br />
                                    {' ' + c.seatingCapacity}
                                    <AirlineSeatLegroomNormalIcon />
                                    {' ' + c.standingCapacity}
                                    <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                </>}

                            </div>
                        </div>
                        <div className='list-item-pics'>
                            {typeOfList !== 'Events' && c.images && c.images.map(i => <div key={i.encodedImage}>
                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                            </div>)}
                            {typeOfList === 'Events' && c.location[0].location.images && c.location[0].location.images.map(i => <div key={i.encodedImage}>
                                <img alt={i.name} className='list-item-pic' src={'data:image/png;base64,' + i.encodedImage} />
                            </div>)}
                        </div>
                    </div>
                </div>)}
            </>}
            {props.authorized === true && props.userData.user.type === 'B' && props.userData.verificationStatus === "NOT_VERIFIED" &&
                <div className='block' style={{ textAlign: 'center' }} >
                    ⓘ You will be able to add businesses to the website after verification.<br />
                    If it doesn't happen within 4 business days, please contact us throught the
                    <Link to="/ContactFormPage"> form</Link>.
                </div>
            }
            {((props.authorized === true && props.userData.user.type === 'C' && typeOfList !== 'Events' && pageSize !== null) || (props.authorized === false && typeOfList !== 'Events' && pageSize !== null)) &&
                <div className='list-sorting-rect' style={{ display: "grid", gridTemplateColumns: 'auto ' }} >
                    <Pagination style={{ justifySelf: 'center' }} count={Math.ceil(totalRes / pageSize)} page={pageNo + 1} onChange={(event, value) => { setPageNo(value - 1); console.log(value) }} shape='rounded' />
                </div>
            }
        </div>)
}