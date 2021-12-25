/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import '../../styles/customer/ListPage.css'

import pplIcon from '../../images/pplIcon.png';


export default function ListPage(props) {
    const { typeOfList } = useParams();

    const [listType, setListType] = useState('');
    useEffect(() => {
        if (typeOfList === 'Venues') {
            setListType('locations')
        } else if (typeOfList === 'Services') {
            setListType('services')
        } else if (typeOfList === 'Caterings') {
            setListType('caterings')
        }
    }, [])

    useEffect(() => { props.setHeaderMessage(typeOfList) }, []);

    const history = useHistory();

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (listType !== '') {
            if (props.userData && props.userData.type === 'B') {
                var myHeaders = new Headers();
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                    credentials: 'include'
                };

                fetch(`http://localhost:8080/api/${listType}/business?id=${props.userId}`, requestOptions)
                    .then(response => response.json())
                    .then(result => setItems(result))
                    .catch(error => console.log('error', error));
            } else {
                fetch(`http://localhost:8080/api/${listType}/allowed/all`).then(res => res.json()).then(result => {
                    setItems(result);
                });
            }
        }
    }, [props.userData, listType])

    //location filters
    const [guestNum, setGuestNum] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (typeOfList === "Venues") {
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://localhost:8080/api/locations/allowed/cities", requestOptions)
                .then(response => response.json())
                .then(result => setCities(result))
                .catch(error => console.log('error', error));

            try {
                setLocation(props.cach.location);
                setGuestNum(props.cach.guestNum);
                setDate(props.cach.date);
            } catch (e) { }
        }
    }, [])


    return (<div className="page-main">
        {(props.authorized === false || (props.authorized === true && props.userData.type === 'C')) && <>
            {typeOfList === "Venues" &&
                <div className="list-filter-rect">
                    City:
                    <select name="City" id="city-select" className='HP-input' style={{ marginBottom: '5px' }}>
                        <option value=" ">{location !== '' && location}</option>
                        {cities.map(c => <option value={c} key={c}>{c}</option>)}
                    </select>
                    <br />
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
                    <input type='button' className='apply-filters-button' value='Apply filters' />
                </div>
            }
            {typeOfList === "Services" && <div className="list-filter-rect">Services filters</div>}
            {typeOfList === "Caterings" && <div className="list-filter-rect">Caterings filters</div>}
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
        {items.map(c => <div key={c.id} className='list-element' onClick={() => history.push(`/ItemDetails/${typeOfList.substring(0, typeOfList.length - 1)}/${c.id}`)}>
            <div className='list-item' >
                <div className='overlay-listing' >
                    <div className='overlay-listing-left'>
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
                    {typeOfList === "Venues" && c.images.map(i => <div key={i.id}>
                        <img alt={i.alt} className='list-item-pic' src={i.image} />
                    </div>)}
                </div>
            </div>
        </div>)}

        {props.authorized === true && props.userData.type === 'C' &&
            <div className='add-item-rect' onClick={() => history.push('/AddBusinessPage/' + typeOfList.substring(0, typeOfList.length - 1))}>
                Add {typeOfList.substring(0, typeOfList.length - 1)}
            </div>
        }
    </div>)
}