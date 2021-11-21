import React from 'react';
import '../styles/CreatePersonalPage.css'
import { Link } from 'react-router-dom'


function SignUpPageContent() {
    return (
        <div className="create-account-page-content">

            <div className="create-account-rect">
                <h1 className="create-personal-h1">
                    Create Account
                </h1>
                <p className="create-acc-input-label">Email</p>
                <input className="input-register" type="text" >
                </input>

                <p className="create-acc-input-label">Name</p>
                <input className="input-register" type="text">
                </input>

                <p className="create-acc-input-label">Surname</p>
                <input className="input-register" type="text">
                </input>

                <p className="create-acc-input-label">Birthdate</p>
                <input className="input-register" type="date">
                </input>

                <p className="create-acc-input-label">Phone number</p>
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