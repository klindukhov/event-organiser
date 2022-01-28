import React from 'react';
import { useHistory, Link } from 'react-router-dom'
import { useState } from 'react/cjs/react.development';
import '../../styles/general/SignInPage.css';
import apiFetch from '../../api'
import { TextField, Button, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';


function SignInPageContent(props) {
    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [loginMessage, setLoginMessage] = useState(' ');
    let history = useHistory();


    const handleLoginInput = (event) => setLoginField(event.target.value);

    const handlePasswordInput = (event) => setPasswordField(event.target.value);


    const handleLogIn = () => {

        let raw = JSON.stringify({ "email": loginField, "password": passwordField });

        apiFetch('login', 'POST', raw)
            .then(response => response.json().then(data => {
                console.log(response.status);
                if (response.status !== 200) {
                    setLoginMessage('Login or password is incorrect');
                } else {
                    props.setAuth(data);
                    if (data.type === 'A') {
                        history.push('/ProblemsPage');
                    } else if (data.user.type === 'C') {
                        history.goBack();
                    } else if (data.user.type === 'B') {
                        history.push('/ReservationRequestsPage');
                    }
                }
            }))
            .catch(error => {
                console.log('error', error);
                setLoginMessage('Login or password is incorrect');
            });
    }

    const handleKeypress = e => {
        if (e.key === 'Enter') {
            handleLogIn();
        }
    };


    return (
        <div className="main">

            <div className="sign-in-rect" >
                <div className="sign-in-h1">
                    Sign in
                </div>
                <TextField margin="dense" size="small" label='Email' className="input-login" type="text" onKeyPress={e => { if (e.key === 'Enter') { document.querySelector('input[name=passwordField]').focus(); } }} onChange={handleLoginInput} />
                <br />
                <TextField margin="dense" size="small" label='Password' className="input-login" InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowInput(!showInput)}
                                edge="end"
                            >
                                {showInput ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }} name='passwordField' onKeyPress={handleKeypress} type={showInput ? 'text' : 'password'} onChange={handlePasswordInput} />
                <br />
                <p style={{ color: 'red' }}>{loginMessage}</p>
                <Button variant='contained' className="input-login-button"
                    onClick={handleLogIn}>
                    Sign in
                </Button>
                <br />
                Don't have an account?
                <Link to="/SignUp">Register</Link>
                <br />
                <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

        </div>
    )
}

export default SignInPageContent;