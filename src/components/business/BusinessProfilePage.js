import React, { useState, useEffect } from 'react';
import '../../styles/business/BusinessProfilePage.css';
import accIcon from '../../images/accIcon250.png'
import { Link } from 'react-router-dom'

export default function BusinessProfilePage(props) {
    const [changes, setChanges] = useState(true);
    const [buttonColor, setButtonColor] = useState('#e5e5e5')

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [businessName, setBusinessName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [postCode, setPostCode] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        props.setHeaderMessage('Profile');

        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/business/${props.userId}/detail`, requestOptions)
            .then(response => response.json())
            .then(res => {
                if (res.firstName !== undefined) {
                    setName(res.firstName);
                    setSurname(res.lastName);
                    setPhoneNumber(res.phoneNumber);
                    setBusinessName(res.businessName);
                    setCountry(res.address.country);
                    setCity(res.address.city);
                    setStreetName(res.address.streetName);
                    setStreetNumber(res.address.streetNumber);
                    setPostCode(res.address.zipCode);
                    setStatus(res.verificationStatus)
                } else {
                    //props.myProps.setUnauth();
                }
            }).catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [props]);

    const handleInput = () => {
        setChanges(false);
        setButtonColor('#47525e');
    }

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordMessageColor, setPasswordMessageColor] = useState('red');

    const handlePasswordSubmit = () => {
        if (newPassword === confirmPassword && newPassword !== '') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "oldPassword": password, "newPassword": newPassword });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
                credentials: 'include'
            };

            fetch(`http://localhost:8080/api/password/change?id=${props.userId}`, requestOptions)
                .then(response => response.text()
                    .then(result => {
                        console.log(result);
                        if (!response.ok) {
                            setPasswordMessage('Password is incorrect')
                        } else {
                            setPasswordMessageColor('#47525e');
                            setPasswordMessage('Password is changed');
                        }
                    }))
                .catch(error => console.log('error', error));
        } else {
            setPasswordMessage('New passwords should match and not be empty')
        }

    }

    const handleSubmitChanges = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "firstName": name, "lastName": surname, "businessName": businessName, "phoneNumber": phoneNumber, "address": { "country": country, "city": city, "streetName": streetName, "streetNumber": streetNumber, "zipCode": postCode } });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow', 
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/business?id=${props.userId}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    return (
        <div className='business-profile-main'>
            <div className='business-profile-rect'>
                <div className='business-pic-and-info'>
                    <div className='business-pic-and-labels'>
                        <img src={accIcon} alt='profile' className='business-profile-image' />
                        <div className='business-profile-info-labels'>
                            <p className='business-profile-field-label'>Name:</p>
                            <p className='business-profile-field-label'>Surname:</p>
                            <p className='business-profile-field-label'>Phone number:</p>
                        </div>
                    </div>
                    <div className='business-profile-info-fields'>
                        <input className='business-profile-field-input' type='text' defaultValue={name} onChange={e => {handleInput(); setName(e.target.value)}} />
                        <input className='business-profile-field-input' type='text' defaultValue={surname} onChange={e => {handleInput(); setSurname(e.target.value)}} />
                        <input className='business-profile-field-input' type='text' defaultValue={phoneNumber} onChange={e => {handleInput(); setPhoneNumber(e.target.value)}} />
                    </div>
                </div>
                <p className='business-info-heading'>Business information</p>

                <div className='business-info'>
                    <div className='business-info-labels'>
                        <p className='business-field-label'>Business name:</p>
                        <p className='business-field-label'>Country:</p>
                        <p className='business-field-label'>City:</p>
                        <p className='business-field-label'>Street:</p>
                        <p className='business-field-label'>Number:</p>
                        <p className='business-field-label'>Postal code:</p>
                        <p className='business-field-label'>Status:</p>
                    </div>
                    <div className='business-info-fields'>
                        <input className='business-field-input' type='text' defaultValue={businessName} onChange={e => {handleInput(); setBusinessName(e.target.value)}} />
                        <input className='business-field-input' type='text' defaultValue={country} onChange={e => {handleInput(); setCountry(e.target.value)}} />
                        <input className='business-field-input' type='text' defaultValue={city} onChange={e => {handleInput(); setCity(e.target.value)}} />
                        <input className='business-field-input' type='text' defaultValue={streetName} onChange={e => {handleInput(); setStreetName(e.target.value)}} />
                        <input className='business-field-input' type='text' defaultValue={streetNumber} onChange={e => {handleInput(); setStreetNumber(e.target.value)}} />
                        <input className='business-field-input' type='text' defaultValue={postCode} onChange={e => {handleInput(); setPostCode(e.target.value)}} />
                        <p className='business-field-label'>{status}</p>

                    </div>
                </div>

                <input type='button' className='submit-business-info' value='Submit changes' disabled={changes} style={{ backgroundColor: buttonColor }} onClick={() => { setChanges(true); setButtonColor('#e5e5e5'); handleSubmitChanges() }}></input>

                <p className='change-password-p' >Change password</p>
                <div className='customer-password-change'>
                    <input className='cust-password-change-field' type='password' onChange={e => setPassword(e.target.value)} placeholder='Password'></input>
                    <input className='cust-password-change-field' type='password' onChange={e => setNewPassword(e.target.value)} placeholder='New password'></input>
                    <input className='cust-password-change-field' type='password' onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password'></input>
                    <input className='cust-password-submit-button' type='button' onClick={handlePasswordSubmit} value='Change password'></input>
                </div>
                <p style={{ color: passwordMessageColor, justifySelf: 'center' }}>{passwordMessage}</p>

                <p className='business-prof-bottom-text' >If you are unsatisfied with our services and/or worried about about your privacy you can </p>
                <Link className='delete-acc-link' to=''>Delete your account</Link>

            </div>
        </div>
    )
}
