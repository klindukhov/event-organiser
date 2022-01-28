import React, { useEffect, useState } from 'react';
import '../../styles/general/SignUpPage.css';
import { useHistory } from 'react-router-dom'
import apiFetch from '../../api';
import { ToggleButton, ToggleButtonGroup, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';





function SignUpPageContent(props) {
    let history = useHistory();

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

    const [errorMessage, setErrorMessage] = useState();


    const [passwordConf, setPasswordConf] = useState('');
    const [accType, setAccType] = useState('C');

    const [accDetails, setAccDetails] = useState(
        <div></div>)

    const handleSignUp = () => {
        if (password !== confirmPassword || password === '') {
            setPasswordConf('Passwords have to match and contain at least one digit, one uppercase letter and a special character');
        } else {

            createUser();
        }
    }

    useEffect(() => {
        if (accType === 'C') {
            setAccDetails('')
        } else {
            setAccDetails(
                <div>
                    <TextField size='small' margin='dense' label='Business name' style={{ marginTop: '30px', width: '250px' }} type="text" onChange={(event) => setBName(event.target.value)}>
                    </TextField><br />
                    <TextField size='small' margin='dense' label='Country' style={{ marginRight: '10px' }} type="text" onChange={(event) => setCountry(event.target.value)}>
                    </TextField>
                    <TextField size='small' margin='dense' label='City' type="text" onChange={(event) => setCity(event.target.value)}>
                    </TextField><br />
                    <TextField size='small' margin='dense' label='Street' style={{ marginRight: '10px' }} type="text" onChange={(event) => setStreet(event.target.value)}>
                    </TextField>
                    <TextField size='small' margin='dense' label='Number' style={{ marginRight: '10px', width: '13%' }} type="text" onChange={(event) => setHouse(event.target.value)}>
                    </TextField>
                    <TextField size='small' margin='dense' label='Zip-code' style={{ width: '15%' }} type="text" onChange={(event) => setZip(event.target.value)}>
                    </TextField>
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
                            history.push('/ReservationRequestsPage');
                        }
                    })
                    .catch(error => console.log('error-login', error));

            }).catch(error => { console.log('error-register', error); setErrorMessage('Please fill all the fields of the form'); });
    }

    const [isPassShow, setIsPassShow] = useState(false);
    const [isCPassShow, setIsCPassShow] = useState(false);


    return (
        <div className="main">

            <div className="sign-up-rect">
                <div className="sign-in-h1">
                    Sign up
                </div>
                <ToggleButtonGroup
                    value={accType}
                    exclusive
                    onChange={() => setAccType(accType === 'C' ? 'B' : 'C')}
                    aria-label="persBus"
                >
                    <ToggleButton value="C" aria-label="personal">
                        Personal
                    </ToggleButton>
                    <ToggleButton value="B" aria-label="business">
                        Business
                    </ToggleButton>
                </ToggleButtonGroup>
                <br />
                <br />
                <TextField size='small' margin='dense' label='Email' style={{width: '250px'}} type="text" onChange={(event) => setEmail(event.target.value)}>
                </TextField>
                <br />
                <TextField size='small' margin='dense' label='Phone number' style={{width: '250px'}} type="text" onChange={(event) => setUPhoneNum(event.target.value)}>
                </TextField>
                <br />
                <TextField size='small' style={{width: '250px'}} margin='dense' label='Password' InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setIsPassShow(!isPassShow)}
                                edge="end"
                            >
                                {isPassShow ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }} type={isPassShow ? "text" : "password"} onChange={(event) => setPassword(event.target.value)}>
                </TextField>
                <br />
                <TextField size='small' style={{width: '250px'}} margin='dense' label='Confirm password' InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setIsCPassShow(!isCPassShow)}
                                edge="end"
                            >
                                {isCPassShow ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }} type={isCPassShow ? "text" : "password"} onChange={(event) => setConfirmPassword(event.target.value)}>
                </TextField>
                <p className='passwords-dont-match'>{passwordConf}</p>
                <br />
                <TextField size='small' margin='dense' style={{width: '250px'}} label='Name' type="text" onChange={(event) => setUName(event.target.value)}>
                </TextField>
                <br />
                <TextField size='small' margin='dense' style={{width: '250px'}} label='Surname' type="text" onChange={(event) => setUSurname(event.target.value)}>
                </TextField>
                <br />
                <TextField size='small' margin='dense' label='Birthdate' InputLabelProps={{ shrink: true }} type="date" onChange={(event) => setUBirthdate(event.target.value)}>
                </TextField>
                <br />
                {accDetails}
                <br />
                <Button variant='contained' style={{ marginTop: '20px' }} className="input-register-button" onClick={() => handleSignUp()}>
                    Sign up
                </Button>
                <br />
                <p style={{ color: "red", fontSize: "12pt" }}>{errorMessage}</p>

            </div>
        </div>
    )
}

export default SignUpPageContent;