import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../../styles/customer/HomePage.css';
import venues from '../../images/venues.png';
import entertainment from '../../images/entertainment.png';
import catering from '../../images/catering.png';
import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';


export default function HomePage(props) {
  const [eventType, setEventType] = useState('');
  const [guestNum, setGuestNum] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const history = useHistory();
  
  useEffect(() => { props.setHeaderMessage('') });

  const [cities, setCities] = useState([]);
  useEffect(() => {
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
  }, [])

  const getProps = () => {
    return {
      eventType: eventType,
      guestNum: guestNum,
      location: location,
      date: date
    }
  }

  return (
    <div>
      <div className="home-page-content">
        <br />
        <br />
        <br />
        <br />
        <h2 className="HP-heading">
          Create your unique event experience
        </h2>
        <p className="HP-subheading">Organize and customize events so that they fit your needs <br />
          while having a full control over guest lists, invitations and entertainment</p>
        <br />
        <br />
        <br />
        <select name="Event type" id="event-type" className='HP-input' onChange={(event) => setEventType(event.target.value)}>
          <option value=" ">Event type</option>
          <option value="wedding">wedding</option>
          <option value="party">party</option>
          <option value="birthday">birthday</option>
          <option value="meeting">meeting</option>
        </select>
        <input placeholder="Number of guests" className='HP-input' onChange={(event) => setGuestNum(event.target.value)} />
        <select name="City" id="city-select" className='HP-input' onChange={(event) => setLocation(event.target.value)}>
          <option value=" ">City</option>
          {cities.map(c => <option value={c} key={c}>{c}</option>)}
        </select>
        <input type="date" placeholder="dd/mm/yyyy" className='HP-input' onChange={(event) => setDate(event.target.value)} />
        <br />
        <br />

        <Link to='/ListPage/Venues'>
          <button className="new-event-button"
            onMouseEnter={e => { e.target.style.cursor = "pointer"; }}
            onMouseLeave={e => { e.target.style.cursor = "default"; }}
            onClick={() => { props.setProps(getProps()) }}>
            Search
          </button>
        </Link>
      </div>
      <br />
      <br />
      <div className="explore">
        <h1 className='Explore-heading'>Explore</h1>
        <br />
        <br />
        <br />
        <div className="explore-grid">
          <div onClick={() => history.push('/ListPage/Venues')}>
            <p className="Explore-subheading">Venues</p>
            <img src={venues} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Find an ideal place to celebrate birthdays, weddings, important <br /> milestones or educate yourself and/or your colleagues.</p>
          </div>
          <div onClick={() => history.push('/ListPage/Caterings')}>
            <p className="Explore-subheading">Catering</p>
            <img src={catering} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Order or get delivered the meals <br />from thousands of restaurants in <br />the area</p>
          </div>
          <div onClick={() => history.push('/ListPage/Services')}>
            <p className="Explore-subheading">Entertainment&other</p>
            <img src={entertainment} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Invite entertainers like DJs, musicians to help create an unique <br />atmosphere at your event as well as important additions to your <br />seminars llike enterpreters or DI’s </p>
          </div>
        </div>
        <br />
        <br />

      </div>
    </div>
  )
}