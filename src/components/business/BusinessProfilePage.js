import React, { useState, useEffect } from 'react';
import '../../styles/business/BusinessProfilePage.css';
import apiFetch from '../../api';
import { Button, TextField } from '@mui/material';

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

    const handleDeleteAccount = () => {
        apiFetch(`business?id=${props.userId}`, "DELETE").then(() => {
            window.location.reload();
        }).catch(e => console.log('error', e));
    }

    return (
        <div className='main'>
            <div className='block' style={{ display: 'grid' }}>
                <div className='fields-main'>
                    <div className='fields-left'>
                        <p className='business-info-heading'>Business information</p>
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='Business name' value={businessName} onChange={e => { handleInput(); setBusinessName(e.target.value) }} /><br />
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='Country' value={country} onChange={e => { handleInput(); setCountry(e.target.value) }} /><br />
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='City' value={city} onChange={e => { handleInput(); setCity(e.target.value) }} /><br />
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='Street' value={streetName} onChange={e => { handleInput(); setStreetName(e.target.value) }} /><br />
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='Number' value={streetNumber} onChange={e => { handleInput(); setStreetNumber(e.target.value) }} /><br />
                        <TextField className='customer-profile-field-input' size='small' margin='normal' label='Postal code' value={postCode} onChange={e => { handleInput(); setPostCode(e.target.value) }} /><br />
                        <p className='business-field-label'>Status: {status}</p>

                    </div>
                    <div className='fields-right'>
                        <p className='business-info-heading'>User information</p>   
                        <TextField className='customer-profile-field-input' margin='normal' size="small" label='Name' InputLabelProps={{ shrink: true }} type='text' value={name} onChange={e => { setName(e.target.value.replace(/ *$/, '')); handleInput() }} /><br />
                        <TextField className='customer-profile-field-input' margin="normal" size="small" label='Surname' InputLabelProps={{ shrink: true }} type='text' value={surname} onChange={e => { setSurname(e.target.value.replace(/ *$/, '')); handleInput() }} /><br />
                        <TextField className='customer-profile-field-input' margin="normal" size="small" label='Phone number' InputLabelProps={{ shrink: true }} type='text' value={phoneNumber} onChange={e => { setPhoneNumber(e.target.value.replace(/ *$/, '')); handleInput() }} /><br />
                        <br/> 
                        <TextField className='customer-profile-field-input' size="small" margin='dense' type='password' onChange={e => setPassword(e.target.value.replace(/ *$/, ''))} label='Password' /><br />
                        <TextField className='customer-profile-field-input' size="small" margin='dense' type='password' onChange={e => setNewPassword(e.target.value.replace(/ *$/, ''))} label='New password' /><br />
                        <TextField className='customer-profile-field-input' size="small" margin='dense' type='password' onChange={e => setConfirmPassword(e.target.value.replace(/ *$/, ''))} label='Confirm password' /><br /><br />
                        <Button className='customer-profile-field-input' variant='contained' size="small" onClick={handlePasswordSubmit} value='Change password'>Change password</Button>
                        <p style={{ color: passwordMessageColor, justifySelf: 'center' }}>{passwordMessage}</p>
                    </div>
                </div>
                <br />
                <Button variant='contained' margin="normal" size="small" className='customer-profile-field-input' disabled={changes} style={{ backgroundColor: buttonColor, justifySelf: 'center' }} onClick={() => { setChanges(true); setButtonColor(getComputedStyle(document.querySelector(':root')).getPropertyValue('--bg')); handleSubmitChanges() }}>Submit changes</Button>
                <br />
                <p className='business-prof-bottom-text' >If you are unsatisfied with our services and/or worried about about your privacy you can
                    <Button className='delete-acc-link' onClick={handleDeleteAccount}>Delete your account</Button></p>
            </div>
        </div>
    )
}
