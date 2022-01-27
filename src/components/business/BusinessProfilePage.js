import React, { useState, useEffect } from 'react';
import '../../styles/business/BusinessProfilePage.css';
import { Link } from 'react-router-dom'
import apiFetch from '../../api';
import { Avatar } from '@mui/material';

export default function BusinessProfilePage(props) {
    const [changes, setChanges] = useState(true);
    const [buttonColor, setButtonColor] = useState('#F2F4F5')

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
        apiFetch(`business/${props.userId}/detail`)
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
            const raw = JSON.stringify({ "oldPassword": password, "newPassword": newPassword });

            apiFetch(`password/change?id=${props.userId}`, "POST", raw)
                .then(() => {
                    setPasswordMessageColor(getComputedStyle(document.querySelector(':root')).getPropertyValue('--txt'));
                    setPasswordMessage('Password is changed');
                })
                .catch(error => { console.log('error', error); setPasswordMessage('Password is incorrect'); setPasswordMessageColor('red') });
        } else {
            setPasswordMessage('New passwords should match and not be empty')
        }

    }

    const handleSubmitChanges = () => {
        const raw = JSON.stringify({ "firstName": name, "lastName": surname, "businessName": businessName, "phoneNumber": phoneNumber, "address": { "country": country, "city": city, "streetName": streetName, "streetNumber": streetNumber, "zipCode": postCode } });

        apiFetch(`business?id=${props.userId}`, "PUT", raw)
            .then(() => {
                setChanges(true);
                setButtonColor('#F2F4F5');
                window.location.reload();
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className='business-profile-main'>
            <div className='business-profile-rect'>
                <div className='business-pic-and-info'>
                    <div className='business-pic-and-labels'>
                        <Avatar alt='profile' className='business-profile-image' style={{
                            height: '250px',
                            width: '250px',
                            margin: '50px',
                            justifySelf: 'center'
                        }} />
                        <div className='business-profile-info-labels'>
                            <p className='business-profile-field-label'>Name:</p>
                            <p className='business-profile-field-label'>Surname:</p>
                            <p className='business-profile-field-label'>Phone number:</p>
                        </div>
                    </div>
                    <div className='business-profile-info-fields'>
                        <input className='business-profile-field-input' type='text' defaultValue={name} onChange={e => { handleInput(); setName(e.target.value) }} />
                        <input className='business-profile-field-input' type='text' defaultValue={surname} onChange={e => { handleInput(); setSurname(e.target.value) }} />
                        <input className='business-profile-field-input' type='text' defaultValue={phoneNumber} onChange={e => { handleInput(); setPhoneNumber(e.target.value) }} />
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
                        <input className='business-field-input' type='text' defaultValue={businessName} onChange={e => { handleInput(); setBusinessName(e.target.value) }} />
                        <input className='business-field-input' type='text' defaultValue={country} onChange={e => { handleInput(); setCountry(e.target.value) }} />
                        <input className='business-field-input' type='text' defaultValue={city} onChange={e => { handleInput(); setCity(e.target.value) }} />
                        <input className='business-field-input' type='text' defaultValue={streetName} onChange={e => { handleInput(); setStreetName(e.target.value) }} />
                        <input className='business-field-input' type='text' defaultValue={streetNumber} onChange={e => { handleInput(); setStreetNumber(e.target.value) }} />
                        <input className='business-field-input' type='text' defaultValue={postCode} onChange={e => { handleInput(); setPostCode(e.target.value) }} />
                        <p className='business-field-label'>{status}</p>

                    </div>
                </div>

                <input type='button' className='submit-business-info' value='Submit changes' disabled={changes} style={{ backgroundColor: buttonColor }} onClick={handleSubmitChanges}></input>

                <p className='change-password-p' >Change password</p>
                <div className='customer-password-change'>
                    <input className='cust-password-change-field' type='password' defaultValue={password} onChange={e => setPassword(e.target.value)} placeholder='Password'></input>
                    <input className='cust-password-change-field' type='password' defaultValue={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder='New password'></input>
                    <input className='cust-password-change-field' type='password' defaultValue={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password'></input>
                    <input className='cust-password-submit-button' type='button' onClick={handlePasswordSubmit} value='Change password'></input>
                </div>
                <p style={{ color: passwordMessageColor, justifySelf: 'center' }}>{passwordMessage}</p>

                <p className='business-prof-bottom-text' >If you are unsatisfied with our services and/or worried about about your privacy you can </p>
                <Link className='delete-acc-link' to=''>Delete your account</Link>

            </div>
        </div>
    )
}
