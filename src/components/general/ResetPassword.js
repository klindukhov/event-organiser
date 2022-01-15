import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiFetch from "../../api";

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
        <div className="signIn-page-content">
            <div className="sign-in-rect" >
                <div className="sign-in-h1">
                    Reset password
                </div>
                <p className='login-input-label'>Password</p>
                <input className="input-login" type="text" onKeyPress={e => { if (e.key === 'Enter') { document.querySelector('input[name=passwordField]').focus(); } }} onChange={e => setPassword(e.target.value)}>
                </input>
                <br />
                <p className='login-input-label'>Password</p>
                <input className="input-login" name='passwordField' onKeyPress={handleKeypress} type={showInput ? 'text' : 'password'} onChange={e => setRepeatPassword(e.target.value)}>
                </input>
                <br />
                <button className='show-password-button' onClick={() => {
                    setShowInput(showInput ? false : true)
                    setPassButtonText(showInput ? 'Show password' : 'Hide password');
                }}>{passButtonText}</button>
                <br />
                <p style={{ color: 'red' }}>{message}</p>
                <button className="input-login-button"
                    onClick={handleSubmit}>
                    Reset
                </button>
            </div>
        </div>)
}