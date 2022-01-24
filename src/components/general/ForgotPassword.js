import React from 'react';
import { useState } from 'react/cjs/react.development';
import '../../styles/general/SignInPage.css';
import apiFetch from '../../api'
import {TextField, Button} from '@mui/material'



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

            <div className="sign-in-rect" style={{height: '300px'}}>
                <div className="sign-in-h1">
                    Reset password
                </div>
                <TextField label='Email' small dense className="input-login" type="text" onChange={handleLoginInput}/>
                <br />
                <br />
                {!loginMessage && <Button variant='contained' className="button"
                    onClick={handleLogIn}>
                    Send a password reset link
                </Button>}
                <br />
                {loginMessage && 'The link for reseting the password has been sent to your email'}
            </div>

        </div>
    )
}
