import React from 'react';
import '../styles/CreatePersonalPage.css'
import { Link } from 'react-router-dom'


function SignUpPageContent(){
    return(
        <div className="create-account-page-content">

            <div className="create-account-rect">
                <h1 className="h1">
                    Create Account
                </h1>
                <p className="p1">Email</p>
                <input className="input-register" type="text" value="Email@example.com">
                </input>
                <p>Name</p>
                
                <input className="input-register" type="text">
                </input>
                <p className="p1">Surname</p>
                
                <input className="input-register" type="text">
                </input>
                <p className="p1">Birthdate</p>
                
                <input className="input-register" type="text">
                </input>
                
                <p className="p1">Phone number</p>
                <input className="input-register" type="text">
                </input>
                <p></p>
                <Link to="/customerHome">
                <button className="input-create-account-button">
                    Create
                </button>
                </Link>
            </div>

        </div>
    )
}

export default SignUpPageContent;