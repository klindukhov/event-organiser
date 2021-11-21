import React, { useState } from 'react';
import '../styles/SignUpPage.css';
import { Link } from 'react-router-dom'




function SignUpPageContent() {
    const [persBackColor, setPersBackColor] = useState('#47525e');
    const [busBackColor, setBusBackColor] = useState('#e5e5e5');
    const [persColor, setPersColor] = useState('white');
    const [busColor, setBusColor] = useState('#47525e');

    const handlePers = () => {
        setPersBackColor('#47525e');
        setPersColor('white');
        setBusBackColor('#e5e5e5');
        setBusColor('#47525e')
    }

    const handleBus = () => {
        setPersBackColor('#e5e5e5');
        setBusColor('white')
        setPersColor('#47525e');
        setBusBackColor('#47525e');
    }

    const businessOrPersonal = () => {
        if (persBackColor === '#47525e') {
            return '/CreatePersonalAccount';
        } else {
            return '/CreateBusinessAccount';
        }
    }


    return (
        <div className="signUp-page-content">

            <div className="sign-up-rect">
                <div className="sign-up-h1">
                    Sign up
                </div>
                <button className="input-acctype-personal" onClick={handlePers} style={{ backgroundColor: `${persBackColor}`, color: `${persColor}` }}>
                    Personal
                </button>
                <button className="input-acctype-business" onClick={handleBus} style={{ backgroundColor: `${busBackColor}`, color: `${busColor}` }}>
                    Business
                </button>
                <br />
                <p className='signup-input-label'>Email</p>
                <input className="input-register" type="text">
                </input>
                <br />
                <p className='signup-input-label'>Password</p>
                <input className="input-register" type="text">
                </input>
                <br />
                <p className='signup-input-label'>Confirm password</p>
                <input className="input-register" type="text">
                </input>
                <br />
                <Link to={businessOrPersonal}>
                    <button className="input-register-button">
                        Sign up
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default SignUpPageContent;