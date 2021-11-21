import React, { useState } from 'react'
import '../styles/VenuesPage.css';

export default function VenuesPage(props) {
    const [singleDay, setSingleDay] = useState(false);

    const handleSingleDay = () => {
        setSingleDay(!singleDay);
    }


    return (
        <div className="venues-main">
            <div className="filter-rect">
                Location
                <input placeholder="Country, city, district" className='venue-input-1'></input>
                <br />
                Event Type
                <select name="Event type" className='venue-input-1' id="event-type">
                    <option value=" ">Event type</option>
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
                    <input type="text" className='venue-input-number' />
                    <input type="checkbox" className='venue-input-seat' />
                    Seated
                    <input type="checkbox" className='venue-input-seat' />
                    Standing
                </div>

                <div className="event-date">
                    <input placeholder="dd/mm/yyyy" type="date" className='venue-input-date' />
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
        </div>
    )

}