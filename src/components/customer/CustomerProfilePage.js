import React, { useState, useEffect } from 'react';
import '../../styles/customer/CustomerProfilePage.css';
import { Link } from 'react-router-dom'
import apiFetch from '../../api';
import { Avatar, TextField, Tooltip } from '@mui/material'

export default function CustomerProfilePage(props) {
    const [changes, setChanges] = useState(true);
    const [buttonColor, setButtonColor] = useState('#F2F4F5')

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatar, setAvatar] = useState('');

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
                .catch(error => { console.log('error', error); setPasswordMessage('Password is incorrect') });
        } else {
            setPasswordMessage('New passwords should match and not be empty')
        }

    }

    useEffect(() => {
        props.setHeaderMessage('Profile');
        apiFetch(`customers?id=${props.userId}`)
            .then(res => {
                if (res.firstName !== undefined) {
                    setName(res.firstName);
                    setSurname(res.lastName);
                    setBirthdate(res.birthdate);
                    setPhoneNumber(res.phoneNumber);
                    setAvatar({ 'pic': 'data:image/png;base64,' + res.avatar.encodedImage });
                } else {
                    props.myProps.setUnauth();
                }
            }).catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [props]);

    const handleSubmit = () => {
        const raw = JSON.stringify({ "address": { "county": " ", "city": " ", "streetName": " ", "streetNumber": " ", "zipCode": " " }, "firstName": name, "lastName": surname, "birthdate": birthdate, "phoneNumber": phoneNumber });

        apiFetch(`customers?id=${props.userId}`, "PUT", raw).catch(error => console.log('error', error));
        if (avatar.file) {
            let data = new FormData();
            data.append("file", avatar.file, avatar.file.name);
            apiFetch(`customer/avatar/upload?customerId=${props.userId}`, 'POST', data, 's');
        }
    }

    const handleInput = () => {
        setChanges(false);
        setButtonColor(getComputedStyle(document.querySelector(':root')).getPropertyValue('--txt'))
    }

    const handleAddPics = e => {
        if (e.target.files && e.target.files[0]) {
            setAvatar({ 'pic': URL.createObjectURL(e.target.files[0]), 'file': e.target.files[0] });
            handleInput();
        }
    }

    return (
        <div className='customer-profile-main'>
            <div className='customer-profile-rect'>

                <div className='customer-pic-and-info'>
                    <div className='customer-pic-and-labels'>
                        <div className="add-images-wrapper" style={{ width: '250px', height: '250px', margin: '50px', justifySelf: 'center' }}>
                            <label htmlFor='add-images' className="add-images-label">
                                <Tooltip title='Add image'>
                                <Avatar src={avatar.pic} alt='profile' style={{ width: '250px', height: '250px', margin: '50px', justifySelf: 'center' }} />
                                </Tooltip>
                            </label>
                            <TextField InputLabelProps={{ shrink: true }} margin="dense" size="small" label='' type='file' className="add-images-input" id='add-images' multiple={true} accept='image/*' onChange={handleAddPics} />
                        </div>
                        <div className='customer-info-labels'>
                            <p className='customer-profile-field-label'>Name:</p>
                            <p className='customer-profile-field-label'>Surname:</p>
                            <p className='customer-profile-field-label'>Birthdate:</p>
                            <p className='customer-profile-field-label'>Phone number:</p>
                        </div>
                    </div>
                    <div className='customer-info-fields'>
                        <input className='customer-profile-field-input' type='text' defaultValue={name} onChange={e => { setName(e.target.value); handleInput() }} />
                        <input className='customer-profile-field-input' type='text' defaultValue={surname} onChange={e => { setSurname(e.target.value); handleInput() }} />
                        <input className='customer-profile-field-input' type='date' defaultValue={birthdate} onChange={e => { setBirthdate(e.target.value); handleInput() }} />
                        <input className='customer-profile-field-input' type='text' defaultValue={phoneNumber} onChange={e => { setPhoneNumber(e.target.value); handleInput() }} />
                    </div>
                </div>
                <input type='button' className='submit-customer-profile' value='Submit changes' disabled={changes} style={{ backgroundColor: buttonColor }} onClick={() => { setChanges(true); setButtonColor(getComputedStyle(document.querySelector(':root')).getPropertyValue('--bg')); handleSubmit() }}></input>
                <p className='change-password-p' >Change password</p>
                <div className='customer-password-change'>
                    <input className='cust-password-change-field' type='password' onChange={e => setPassword(e.target.value)} placeholder='Password'></input>
                    <input className='cust-password-change-field' type='password' onChange={e => setNewPassword(e.target.value)} placeholder='New password'></input>
                    <input className='cust-password-change-field' type='password' onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password'></input>
                    <input className='cust-password-submit-button' type='button' onClick={handlePasswordSubmit} value='Change password'></input>
                </div>
                <p style={{ color: passwordMessageColor, justifySelf: 'center' }}>{passwordMessage}</p>
                <p className='cust-prof-bottom-text' >If you are unsatisfied with our services and/or worried about your privacy you can </p>
                <Link className='delete-acc-link' to=''>Delete your account</Link>
            </div>
        </div>
    )
}