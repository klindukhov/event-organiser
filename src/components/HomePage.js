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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h2>
          Create your unique event experience
        </h2>
        <p className="hpText">Organize and customize events so that they fit your needs <br />
          while having a full control over guest lists, invitations and entertainment</p>
        <br></br>
        <br></br>
        <br></br>
        <select name="Event type" id="event-type">
          <option value=" ">Event type</option>
          <option value="wedding">wedding</option>
          <option value="party">party</option>
          <option value="birthday">birthday</option>
          <option value="meeting">meeting</option>
        </select>
        <input placeholder="Number of guests"></input>
        <input placeholder="City"></input>
        <input type="date" placeholder="dd/mm/yyyy"></input>
        <br></br>
        <br></br>
        <Link to='/signIn'>
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
        <h1>Explore</h1>
        <br />
        <br />
        <br />
        <div className="explore-grid">
          <div>
            <p className="p">Venues</p>
            <img src={venues} alt="venuesPic" className="explore-imgs" />
            <p className="p">Find an ideal place to celebrate birthdays, weddings, important <br /> milestones or educate yourself and/or your colleagues.</p>
          </div>
          <div>
            <p className="p">Catering</p>
            <img src={catering} alt="venuesPic" className="explore-imgs" />
            <p className="p">Order or get delivered the meals <br />from thousands of restaurants in <br />the area</p>
          </div>
          <div>
            <p className="p">Entertainment&other</p>
            <img src={entertainment} alt="venuesPic" className="explore-imgs" />
            <p className="p">Invite entertainers like DJs, musicians to help create an unique <br />atmosphere at your event as well as important additions to your <br />seminars llike enterpreters or DI’s </p>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  )
}