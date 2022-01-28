import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiFetch from "../../api";
import {TextField, Button} from '@mui/material'

export default function ResetPasswordPage() {
    const { token } = useParams();
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState(false);

    const handleSubmit = () => {
        if (password === repeatPassword) {
            apiFetch(`reset?token=${token}`, "POST", JSON.stringify({ "password": password }))
                .then(res => {
                    if (res.ok) {
                        history.push('/');
                    } else {
                        setMessage(true);
                    }
                })
        } else {
            setMessage(true);
        }
    }

    const handleKeypress = e => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };


    const [showInput, setShowInput] = useState(false);
    const [passButtonText, setPassButtonText] = useState('Show password');

    return (
        <div className="main">
            <div className="sign-in-rect" style={{height: '350px'}}>
                <div className="sign-in-h1">
                    Reset password
                </div>
                <TextField size='small' dense label='Password' className="input-login" type={showInput ? 'text' : 'password'} onKeyPress={e => { if (e.key === 'Enter') { document.querySelector('input[name=passwordField]').focus(); } }} onChange={e => setPassword(e.target.value)}/>                
                <br />
                <TextField size='small' dense label='Repeat password' className="input-login" name='passwordField' onKeyPress={handleKeypress} type={showInput ? 'text' : 'password'} onChange={e => setRepeatPassword(e.target.value)}/>
                <br />
                <Button variant='contained' className='show-password-button' onClick={() => {
                    setShowInput(showInput ? false : true)
                    setPassButtonText(showInput ? 'Show password' : 'Hide password');
                }}>{passButtonText}</Button>
                <br />
                <p style={{ color: 'red' }}>{message}</p>
                <Button variant='contained' className="input-login-button"
                    onClick={handleSubmit}>
                    Reset
                </Button>
            </div>
        </div>)
}