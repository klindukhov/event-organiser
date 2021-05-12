import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page-content">
      <h1>
                *LOGO*
            </h1>
            <h2>
                Start planning by creating a new event!
            </h2>
            <br></br>
            <br></br>
            <br></br>
            <Link to='/signIn'>
            <button className="new-event-button"                     
                    onMouseEnter={e => {e.target.style.cursor = "pointer";}}
                    onMouseLeave={e => {e.target.style.cursor = "default";}}>
                Create event
            </button>
            </Link>
    </div>
  )
}