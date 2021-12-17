import React from 'react';
import { useHistory, Link } from 'react-router-dom'
import { useState } from 'react/cjs/react.development';
import '../../styles/general/SignInPage.css';


function SignInPageContent(props) {
    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [passButtonText, setPassButtonText] = useState('Show password');
    const [loginMessage, setLoginMessage] = useState(' ');
    let history = useHistory();


    const handleLoginInput = (event) => setLoginField(event.target.value);

    const handlePasswordInput = (event) => setPasswordField(event.target.value);


    const handleLogIn = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({ "email": loginField, "password": passwordField });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch("http://localhost:8080/api/login", requestOptions)
            .then(response => response.json().then( data => {
                console.log(response.status);
                if (response.status !== 200) {
                    setLoginMessage('Login or password is incorrect');
                } else {
                    props.setAuth(data);
                    if(data.type === 'C'){
                        history.push('/');
                    }else if(data.type === 'A'){
                        history.push('/AdminHomePage');
                    }else if(data.type === 'B'){
                        history.push('/BusinessHomePage');
                    }
                }
            }))
            .catch(error => {console.log('error', error);
            setLoginMessage('Login or password is incorrect');});
    }

    const handleKeypress = e => {
      if (e.key === 'Enter') {
        handleLogIn();
      }
    };


    return (
        <div className="signIn-page-content">

            <div className="sign-in-rect" >
                <div className="sign-in-h1">
                    Sign in
                </div>
                <p className='login-input-label'>Email</p>
                <input className="input-login" type="text" onChange={handleLoginInput}>
                </input>
                <br />
                <p className='login-input-label'>Password</p>
                <input className="input-login" onKeyPress={handleKeypress} type={showInput ? 'text' : 'password'} onChange={handlePasswordInput}>
                </input>
                <br />
                <button className='show-password-button' onClick={() => {
                    setShowInput(showInput ? false : true)
                    setPassButtonText(showInput ? 'Show password' : 'Hide password');
                }}>{passButtonText}</button>
                <br />
                <p style={{ color: 'red' }}>{loginMessage}</p>
                <button className="input-login-button"
                    onClick={handleLogIn}>
                    Sign in
                </button>
                <br />
                Don't have an account?
                <Link to="/SignUp">Register</Link>
                <br />
                <Link to="/SignUp">Forgot password?</Link>
            </div>

        </div>
    )
}

export default SignInPageContent;