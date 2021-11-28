import React, { useState } from 'react';
import '../styles/SignUpPage.css';
import { useHistory } from 'react-router-dom'




function SignUpPageContent(props) {
    let history = useHistory();

    const [persBackColor, setPersBackColor] = useState('#47525e');
    const [busBackColor, setBusBackColor] = useState('#e5e5e5');
    const [persColor, setPersColor] = useState('white');
    const [busColor, setBusColor] = useState('#47525e');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [accType, setAccType] = useState('C');

    const handleSignUp = () => {
        props.setProps(
            {
                email: email
            }
        )
        if (password !== confirmPassword || password === '') {
            setPasswordConf('passwords have to match and not be empty');
        } else {
            createUser();
            history.push(businessOrPersonal());
        }
    }

    const handlePers = () => {
        setPersBackColor('#47525e');
        setPersColor('white');
        setBusBackColor('#e5e5e5');
        setBusColor('#47525e');
        setAccType('C');
    }

    const handleBus = () => {
        setPersBackColor('#e5e5e5');
        setBusColor('white')
        setPersColor('#47525e');
        setBusBackColor('#47525e');
        setAccType('B');
    }

    const businessOrPersonal = () => {
        if (persBackColor === '#47525e') {
            return '/CreatePersonalAccount';
        } else {
            return '/CreateBusinessAccount';
        }
    }

    const createUser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "email": email, "password": password, "type": accType });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/register", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
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
                <input className="input-register" type="text" onChange={(event) => setEmail(event.target.value)}>
                </input>
                <br />
                <p className='signup-input-label'>Password</p>
                <input className="input-register" type="password" onChange={(event) => setPassword(event.target.value)}>
                </input>
                <br />
                <p className='signup-input-label'>Confirm password</p>
                <input className="input-register" type="text" onChange={(event) => setConfirmPassword(event.target.value)}>
                </input>
                <p className='passwords-dont-match'>{passwordConf}</p>
                <br />
                <button className="input-register-button" onClick={() => handleSignUp()}>
                    Sign up
                </button>
            </div>
        </div>
    )
}

export default SignUpPageContent;