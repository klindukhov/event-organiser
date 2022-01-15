import React from 'react';
import { useState } from 'react/cjs/react.development';
import '../../styles/general/SignInPage.css';
import apiFetch from '../../api'


export default function ForgotPassword(props) {
    const [loginField, setLoginField] = useState('');
    const [loginMessage, setLoginMessage] = useState(false);


    const handleLoginInput = (event) => setLoginField(event.target.value);


    const handleLogIn = () => {
        apiFetch( `reset_password?email=${loginField}`, 'POST')
            .then(()  => {
                setLoginMessage(true);
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    return (
        <div className="signIn-page-content">

            <div className="sign-in-rect" >
                <div className="sign-in-h1">
                    Reset password
                </div>
                <p className='login-input-label'>Email</p>
                <input className="input-login" type="text" onChange={handleLoginInput}>
                </input>
                <br />
                <br />
                {!loginMessage && <button className="button"
                    onClick={handleLogIn}>
                    Send a password reset link
                </button>}
                <br />
                {loginMessage && 'The link for reseting the password has been sent to your email'}
            </div>

        </div>
    )
}
