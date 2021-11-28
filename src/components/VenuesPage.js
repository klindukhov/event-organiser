import React, { useState, useEffect } from 'react'
import '../styles/VenuesPage.css';

import image1 from '../images/image1.png';
import image2 from '../images/image2.png';
import image3 from '../images/image3.png';
import pplIcon from '../images/pplIcon.png';

export default function VenuesPage(props) {
    const [singleDay, setSingleDay] = useState(false);

    const [eventType, setEventType] = useState('');
    const [guestNum, setGuestNum] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => { props.setHeaderMessage('Venues') });
    useEffect(() => {
        try {
            if (props.cach.location) { setLocation(props.cach.location) }
            if (props.cach.eventType) { setEventType(props.cach.eventType) }
            if (props.cach.guestNum) { setGuestNum(props.cach.guestNum) }
            if (props.cach.date) { setDate(props.cach.date) }

        } catch (error) { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSingleDay = () => {
        setSingleDay(!singleDay);
    }



    return (
        <div className="venues-main">
            <div className="filter-rect">
                Location
                <input placeholder='Location' defaultValue={location} className='venue-input-1'></input>
                <br />
                Event Type
                <select name="Event type"  className='venue-input-1' id="event-type">
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
                    <input defaultValue={date} type="date" className='venue-input-date' />
                    to
                    <input placeholder="dd/mm/yyyy" type="date" className='venue-input-date' disabled={singleDay} />
                    <input type="checkbox" className='venue-input-date' onClick={handleSingleDay} />
                    Single day event
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

            <div className='restaurant-listing'>
                <div className='overlay-listing'>
                    <div className='overlay-listing-left'>
                        Restaurant 1, address <br />
                        Cuisine, description
                        <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                        70
                    </div>
                    <div className='overlay-listing-right'>
                        &#9733; &#9733; &#9733; <br />
                        From 75pln/h
                    </div>
                </div>
                <div className='rest-listing-pics'>
                    <img alt='rest-pic' className='rest-listing-pic' src={image1} />
                    <img alt='rest-pic' className='rest-listing-pic' src={image2} />
                    <img alt='rest-pic' className='rest-listing-pic' src={image3} />
                </div>
            </div>

            <div className='restaurant-listing'>
                <div className='overlay-listing'>
                    <div className='overlay-listing-left'>
                        Restaurant 2, address <br />
                        Cuisine, description
                        <img className='ppl-icon' alt='ppl-icon' src={pplIcon} />
                        30
                    </div>
                    <div className='overlay-listing-right'>
                        &#9733; &#9733; &#9733; &#9733; <br />
                        From 100pln/h
                    </div>
                </div>
                <div className='rest-listing-pics'>
                    <img alt='rest-pic' className='rest-listing-pic' src={image3} />
                    <img alt='rest-pic' className='rest-listing-pic' src={image2} />
                    <img alt='rest-pic' className='rest-listing-pic' src={image1} />
                </div>
            </div>
        </div>
    )

}