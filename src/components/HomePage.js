import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePage.css';
import venues from '../images/venues.png';
import entertainment from '../images/entertainment.png';
import catering from '../images/catering.png';


export default function HomePage() {
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
        <select name="Event type" id="event-type" className='HP-input'>
          <option value=" ">Event type</option>
          <option value="wedding">wedding</option>
          <option value="party">party</option>
          <option value="birthday">birthday</option>
          <option value="meeting">meeting</option>
        </select>
        <input placeholder="Number of guests" className='HP-input'></input>
        <input placeholder="City" className='HP-input'></input>
        <input type="date" placeholder="dd/mm/yyyy" className='HP-input'></input>
        <br />
        <br />

        <Link to='/VenuesPage'>
          <button className="new-event-button"
            onMouseEnter={e => { e.target.style.cursor = "pointer"; }}
            onMouseLeave={e => { e.target.style.cursor = "default"; }}>
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
          <div>
            <p className="Explore-subheading">Venues</p>
            <img src={venues} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Find an ideal place to celebrate birthdays, weddings, important <br /> milestones or educate yourself and/or your colleagues.</p>
          </div>
          <div>
            <p className="Explore-subheading">Catering</p>
            <img src={catering} alt="venuesPic" className="explore-imgs" />
            <p className="Explore-par">Order or get delivered the meals <br />from thousands of restaurants in <br />the area</p>
          </div>
          <div>
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