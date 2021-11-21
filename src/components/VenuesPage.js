import React from 'react'
import '../styles/VenuesPage.css';
import Header from './main/Header';

export default function VenuesPage(props){

    return(
        <div className="main">
            <div className="filter-rect">
                Location
                <input placeholder="Country, city, district" className='venue-input-1'></input>
                <br/>
                Event Type
                <select name="Event type" id="event-type">
                <option value=" ">Event type</option>
                <option value="wedding">wedding</option>
                <option value="party">party</option>
                <option value="birthday">birthday</option>
                <option value="meeting">meeting</option>
                </select>
                <br/>
                Location type
                <select name="Location type" id="event-type">
                <option value=" ">Location type</option>
                <option value="reastaurant">wedding</option>
                <option value="cafe">party</option>
                <option value="hall">birthday</option>
                <option value="office">meeting</option>
                </select>
                <div className="guests-choice">
                    Number of guests
                    <input type="text"></input>
                    <input type="checkbox"></input>
                    Seated
                    <input type="checkbox"></input>
                    Standing
                </div>
                <div className="evnt-date">
                    <input placeholder="dd/mm/yyyy" type="date"></input>
                    to
                    <input placeholder="dd/mm/yyyy" type="date"></input>
                    <input type="checkbox"></input>
                    Single day event
                </div>
                Must have:
                    <br/>
                <div className="must-haves">
                    <div>
                <input id="wifi" type="checkbox"></input>Wi-Fi
                </div><div>
                <input id="stage" type="checkbox"></input>Stage
                </div><div>
                <input id="alcohol" type="checkbox"></input>Serves alcohol
                </div><div>
                <input id="own-alcohol" type="checkbox"></input>Can bring own alcohol
                </div><div>
                <input id="otside-catering" type="checkbox"></input>Outside catering
                </div><div>
                <input id="wheelchair-accessible" type="checkbox"></input>Wheelchair accessible 
                </div><div>
                <input id="outside-patio" type="checkbox"></input>Outside patio
                </div><div>
                <input id="food" type="checkbox"></input>Serves food
                </div><div>
                <input id="own-food" type="checkbox"></input>Can bring own food
                </div>
                </div>
            </div>
        </div>
    )

}