import React, { useEffect, useState } from 'react';
import '../../styles/general/SignUpPage.css';
import { useHistory } from 'react-router-dom'
import apiFetch from '../../api';





function SignUpPageContent(props) {
    let history = useHistory();

    const [persBackColor, setPersBackColor] = useState('#47525e');
    const [busBackColor, setBusBackColor] = useState('#e5e5e5');
    const [persColor, setPersColor] = useState('white');
    const [busColor, setBusColor] = useState('#47525e');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [uName, setUName] = useState('');
    const [uSurname, setUSurname] = useState('');
    const [uBirthdate, setUBirthdate] = useState('');
    const [uPhoneNum, setUPhoneNum] = useState('');
    const [bName, setBName] = useState('');
    const [country, setCountry] = useState(' ');
    const [city, setCity] = useState(' ');
    const [street, setStreet] = useState(' ');
    const [house, setHouse] = useState(' ');
    const [zip, setZip] = useState(' ');


    const [passwordConf, setPasswordConf] = useState('');
    const [accType, setAccType] = useState('C');

    const [accDetails, setAccDetails] = useState(
        <div></div>)

    const handleSignUp = () => {
        if (password !== confirmPassword || password === '') {
            setPasswordConf('passwords have to match and not be empty');
        } else {

            createUser();
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

    useEffect(() => {
        if (accType === 'C') {
            setAccDetails(
                <div> </div>
            )
        } else {
            setAccDetails(
                <div>
                    <p className="signup-input-label">Business name</p>
                    <input className="input-register" type="text" onChange={(event) => setBName(event.target.value)}>
                    </input>

                    <p className="signup-input-label">Country</p>
                    <input className="input-register" type="text" onChange={(event) => setCountry(event.target.value)}>
                    </input>

                    <p className="signup-input-label">City</p>
                    <input className="input-register" type="text" onChange={(event) => setCity(event.target.value)}>
                    </input>

                    <p className="signup-input-label">Street</p>
                    <input className="input-register" type="text" onChange={(event) => setStreet(event.target.value)}>
                    </input>

                    <p className="signup-input-label">House</p>
                    <input className="input-register" type="text" onChange={(event) => setHouse(event.target.value)}>
                    </input>

                    <p className="signup-input-label">Zip-code</p>
                    <input className="input-register" type="text" onChange={(event) => setZip(event.target.value)}>
                    </input>
                </div>
            )
        }
    }, [accType]);

    const createUser = () => {
        let raw;
        let accT;
        if (accType === 'C') {
            raw = JSON.stringify({ "email": email, "password": password, "firstName": uName, "lastName": uSurname, "birthdate": uBirthdate, "phoneNumber": uPhoneNum, "address": { "country": country, "city": city, "streetName": street, "streetNumber": house, "zipCode": zip } });
            accT = 'customer';
        } else {
            raw = JSON.stringify({ "email": email, "password": password, "firstName": uName, "lastName": uSurname, "businessName": bName, "phoneNumber": uPhoneNum, "address": { "country": country, "city": city, "streetName": street, "streetNumber": house, "zipCode": zip } });
            accT = 'business';
        }
        apiFetch(`register/${accT}`, "POST", raw)
            .then(res => {
                let login = JSON.stringify({ "email": email, "password": password });

                apiFetch('login', 'POST', login)
                    .then(resp => resp.json())
                    .then(data => {
                        props.setAuth(data);
                        if (data.user.type === 'C') {
                            history.push('/');
                        } else if (data.user.type === 'B') {
                            history.push('/BusinessHomePage');
                        }
                    })
                    .catch(error => console.log('error-login', error));

            }).catch(error => console.log('error-register', error));
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
                <input className="input-register" type="password" onChange={(event) => setConfirmPassword(event.target.value)}>
                </input>
                <p className='passwords-dont-match'>{passwordConf}</p>
                <br />
                <p className="signup-input-label">Name</p>
                <input className="input-register" type="text" onChange={(event) => setUName(event.target.value)}>
                </input>

                <p className="signup-input-label">Surname</p>
                <input className="input-register" type="text" onChange={(event) => setUSurname(event.target.value)}>
                </input>

                <p className="signup-input-label">Birthdate</p>
                <input className="input-register" type="date" onChange={(event) => setUBirthdate(event.target.value)}>
                </input>

                <p className="signup-input-label">Phone number</p>
                <input className="input-register" type="text" onChange={(event) => setUPhoneNum(event.target.value)}>
                </input>
                {accDetails}
                <button className="input-register-button" onClick={() => handleSignUp()}>
                    Sign up
                </button>

            </div>
        </div>
    )
}

export default SignUpPageContent;