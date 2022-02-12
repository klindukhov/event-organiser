import React from 'react'
import { useHistory } from 'react-router-dom'
import '../../styles/customer/HomePage.css';
import venues from '../../images/venues.png';
import entertainment from '../../images/entertainment.png';
import catering from '../../images/catering.png';
import { useEffect, useState } from 'react';
import apiFetch from '../../api';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


export default function HomePage(props) {
  const [eventType, setEventType] = useState('');
  const [guestNum, setGuestNum] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const history = useHistory();

  // eslint-disable-next-line
  useEffect(() => { props.setHeaderMessage(''); handleSearch(); }, []);

  const [cities, setCities] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  useEffect(() => {
    apiFetch(`locations/allowed/cities`)
      .then(result => setCities(result))
      .catch(error => console.log('error', error));

    apiFetch(`events/types/allowed/all`)
      .then(result => setEventTypes(result))
      .catch(error => console.log('error', error));
  }, [])

  const handleSearch = () => {
    window.sessionStorage.setItem('filters', JSON.stringify({
      eventType: eventType,
      guestNum: guestNum,
      location: location,
      date: date
    }))
  }

  return (
    <div className='home'>
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
        <FormControl className='HP-input' size='small' style={{marginRight: '10px', backgroundColor: 'white', borderRadius:'5px'}}>
          <InputLabel id='event-type-label'>Event type</InputLabel>
          <Select labelId='event-type-label' label="Event type" size='small'  onChange={(event) => setEventType(event.target.value)}>
            {eventTypes.map(t => <MenuItem value={t.type} key={t.type}>{t.type}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField label="Number of guests" size='small' className='HP-input' style={{marginRight: '10px', backgroundColor: 'white', borderRadius:'5px'}} onChange={(event) => setGuestNum(event.target.value)} />
        <FormControl className='HP-input' size='small' style={{marginRight: '10px', backgroundColor: 'white', borderRadius:'5px'}} >
          <InputLabel id='city-input'>City</InputLabel>
          <Select label="City" labelId='city-input' id="city-select" size='small'  onChange={(event) => setLocation(event.target.value)}>
          {cities.map(c => <MenuItem value={c} key={c}>{c}</MenuItem>)}
        </Select>
        </FormControl>
        
        <TextField type="date" label="date" style={{ backgroundColor: 'white', borderRadius:'5px'}} InputLabelProps={{ shrink: true }} size='small' className='HP-input' onChange={(event) => setDate(event.target.value)} />
        <br />
        <br />

        <Button className="new-event-button"
          variant='contained'
          onClick={() => {
            handleSearch();
            history.push('/ListPage/Venues');
          }}>
          Search
        </Button>
      </div>
      <br />
      <br />
      <div className="explore">
        <h1 className='Explore-heading'>Explore</h1>
        <br />
        <br />
        <br />
        <div className="explore-grid">
          <div className='exp-div' onClick={() => history.push('/ListPage/Venues')}>
            <p className="Explore-subheading">Venues</p>
            <img src={venues} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Find an ideal place to celebrate birthdays, weddings, important <br /> milestones or educate yourself and/or your colleagues.</p>
          </div>
          <div className='exp-div' onClick={() => history.push('/ListPage/Caterings')}>
            <p className="Explore-subheading">Catering</p>
            <img src={catering} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Order or get delivered the meals <br />from thousands of restaurants in <br />the area</p>
          </div>
          <div className='exp-div' onClick={() => history.push('/ListPage/Services')}>
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