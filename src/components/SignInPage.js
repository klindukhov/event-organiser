import React from 'react';
import { Link } from 'react-router-dom'
import { useState } from 'react/cjs/react.development';
import '../styles/SignInPage.css';


function SignInPageContent() {
    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [passButtonText, setPassButtonText] = useState('Show password');

    const handleLoginInput = (event) => setLoginField(event.target.value);

    const handlePasswordInput = (event) => setPasswordField(event.target.value);


    const handleLogIn = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "JSESSIONID=088915B51FBD8E6B1513CA42BF2476D7");

  //      let raw = JSON.stringify({ "email": "admin@gmail.com", "password": "admin" });

        let raw = JSON.stringify({ "email": loginField, "password": passwordField });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/login", requestOptions)
            .then(response => console.log(response.status))
            .catch(error => console.log('error', error));
    }


    return (
        <div className="signIn-page-content">
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="sign-in-rect">
                <div className="sign-in-h1">
                    Sign in
                </div>
                <p>Email</p>
                <input className="input-login" type="text" onChange={handleLoginInput}>
                </input>
                <br></br>
                <p>Password</p>
                <input className="input-login" type={showInput?'text':'password'} onChange={handlePasswordInput}>
                </input>
                <br></br>
                <button className='show-password-button' onClick={() => {
                    setShowInput(showInput?false : true)
                    setPassButtonText(showInput? 'Show password' : 'Hide password');
                    }}>{passButtonText}</button>
                <br></br>
                {/* <Link to="/customerHome"> */}
                <button className="input-login-button"
                    onMouseEnter={e => { e.target.style.cursor = "pointer"; }}
                    onMouseLeave={e => { e.target.style.cursor = "default"; }}
                    onClick={handleLogIn}
                >
                    Sign in
                </button>
                {/* </Link> */}
                <br></br>
                Dont have an account?
                <Link to="/SignUp">Register</Link>
                <br></br>
                <Link to="/SignUp">Forgot password?</Link>


            </div>

        </div>
    )
}

export default SignInPageContent;