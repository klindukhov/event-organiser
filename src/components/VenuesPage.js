import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/VenuesPage.css';

import pplIcon from '../images/pplIcon.png';

export default function VenuesPage(props) {

    //filters
    const [eventType, setEventType] = useState('');
    const [guestNum, setGuestNum] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const [locs, setLocs] = useState([]);

    useEffect(() => {
        props.setHeaderMessage('Venues');

        try {
            if (props.cach.location) { setLocation(props.cach.location) }
            if (props.cach.eventType) { setEventType(props.cach.eventType) }
            if (props.cach.guestNum) { setGuestNum(props.cach.guestNum) }
            if (props.cach.date) { setDate(props.cach.date) }
        } catch (error) { }

        getAllLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const getAllLocations = () => {
        fetch("http://localhost:8080/api/locations/allowed/all").then(res => res.json()).then(locations => {
            setLocs(locations);
        });
    }


    return (
        <div className="venues-main">
            <div className="filter-rect">
                Location
                <input placeholder='Location' defaultValue={location} className='venue-input-1'></input>
                <br />
                Event Type
                <select name="Event type" className='venue-input-1' id="event-type">
                    <option value=" ">{eventType}</option>
                    <option value="wedding">wedding</option>
                    <option value="party">party</option>
                    <option value="birthday">birthday</option>
                    <option value="meeting">meeting</option>
                </select>
                <br />
                Location type
                <select name="Location type" className='venue-input-1' id="event-type">
                    <option value=" ">Location type</option>
                    <option value="reastaurant">wedding</option>
                    <option value="cafe">party</option>
                    <option value="hall">birthday</option>
                    <option value="office">meeting</option>
                </select>
                <div className="guests-choice">
                    Number of guests
                    <input type="text" className='venue-input-number' defaultValue={guestNum} contentEditable />
                    <input type="checkbox" className='venue-input-seat' />
                    Seated
                    <input type="checkbox" className='venue-input-seat' />
                    Standing
                </div>

                <div className="event-date">
                    Date
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
            </div>
            <div className='venue-sorting-rect'>
                <p className='displaying-info'>Displaying 1-20 results out of 50</p>
                <div className='select-venue-sorting'>
                    Sort by:
                    <select className='select-venue-sorting'>
                        <option value='default'>Deafault</option>
                        <option value='priceLow'>Price: lowest first</option>
                        <option value='priceHigh'>Price: highest first</option>
                        <option value='priceHigh'>Rating: lowest first</option>
                        <option value='priceHigh'>Rating: highest first</option>
                    </select>
                </div>
            </div>
            {locs.map(c => <div key={c.name} className='restaurant-list-element'>
                <Link to={`/RestaurantPage${Object.values(c)[0]}`} style={{ textDecoration: 'none' }}>
                    <div className='restaurant-listing' >
                        <div className='overlay-listing' >
                            <div className='overlay-listing-left'>
                                {Object.values(c)[1]} , {Object.values(c)[10].city}, {Object.values(c)[10].streetName}/{Object.values(c)[10].streetNumber}<br />
                                {Object.values(c)[6]}
                                <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                                {Object.values(c)[4]}
                            </div>
                            <div className='overlay-listing-right'>
                                From {Object.values(c)[8]}pln/day
                            </div>
                        </div>
                        <div className='rest-listing-pics'>
                            {Object.values(c)[18].map(i => <div key={i.id}>
                                <img alt={Object.values(i)[1]} className='rest-listing-pic' src={Object.values(i)[0]} />
                            </div>)}
                        </div>
                    </div>
                </Link>
            </div>)}
        </div>
    )

}