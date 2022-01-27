import React, { useState, useEffect } from 'react';
import '../../styles/customer/CustomerProfilePage.css';
import apiFetch from '../../api';
import { Avatar, Button, IconButton, TextField, Tooltip } from '@mui/material'
import { Delete } from '@mui/icons-material';

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

        apiFetch(`customers?id=${props.userId}`, "PUT", raw).then(() => {
            if (avatar.file) {
                let data = new FormData();
                data.append("file", avatar.file, avatar.file.name);
                apiFetch(`customers/avatar/upload?customerId=${props.userId}`, 'POST', data, 's').then(() => window.location.reload()).catch(e => console.log('error', e))
            } else {
                window.location.reload()
            }
        }).catch(error => console.log('error', error));

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

    const handleDeleteAvatar = () => {
        apiFetch(`customers/avatar/delete?customerId=${props.userId}`, "DELETE").then(() => window.location.reload()).catch(e => console.log('error', e));
    }

    const handleDeleteAccount = () => {
        apiFetch(`customer?id=${props.userId}`).then(() => {
            window.location.reload();
        }).catch(e => console.log('error', e));
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
                                <Tooltip placement='right-start' title='Delete avatar'>
                                    <IconButton style={{ position: 'relative', zIndex: '3', top: '-330px', left: '300px' }} onClick={handleDeleteAvatar} ><Delete /></IconButton>
                                </Tooltip>
                            </label>
                            <TextField InputLabelProps={{ shrink: true }} margin="dense" size="small" label='' type='file' className="add-images-input" id='add-images' multiple={true} accept='image/*' onChange={handleAddPics} />
                        </div>
                    </div>
                    <div className='customer-info-fields'>
                        <TextField className='customer-profile-field-input' margin='normal' size="small" label='Name' InputLabelProps={{ shrink: true }} type='text' value={name} onChange={e => { setName(e.target.value); handleInput() }} />
                        <TextField className='customer-profile-field-input' margin="normal" size="small" label='Surname' InputLabelProps={{ shrink: true }} type='text' value={surname} onChange={e => { setSurname(e.target.value); handleInput() }} />
                        <TextField className='customer-profile-field-input' margin="normal" size="small" label='Birthdate' InputLabelProps={{ shrink: true }}  type='date' value={birthdate} onChange={e => { setBirthdate(e.target.value); handleInput() }} />
                        <TextField className='customer-profile-field-input' margin="normal" size="small" label='Phone number' InputLabelProps={{ shrink: true }} type='text' value={phoneNumber} onChange={e => { setPhoneNumber(e.target.value); handleInput() }} /><br/>
                        <Button variant='contained' margin="normal" size="small" className='customer-profile-field-input' disabled={changes} style={{ backgroundColor: buttonColor }} onClick={() => { setChanges(true); setButtonColor(getComputedStyle(document.querySelector(':root')).getPropertyValue('--bg')); handleSubmit() }}>Submit changes</Button>
                    </div>
                </div>
                <p className='change-password-p' >Change password</p>
                <div className='customer-password-change'>
                    <TextField className='cust-password-change-field' size="small" type='password' onChange={e => setPassword(e.target.value)} label='Password' />
                    <TextField className='cust-password-change-field' size="small" type='password' onChange={e => setNewPassword(e.target.value)} label='New password' />
                    <TextField className='cust-password-change-field' size="small" type='password' onChange={e => setConfirmPassword(e.target.value)} label='Confirm password' />
                    <Button variant='contained'  onClick={handlePasswordSubmit} value='Change password'>Change password</Button>
                </div>
                <p style={{ color: passwordMessageColor, justifySelf: 'center' }}>{passwordMessage}</p>
                <p className='cust-prof-bottom-text' >If you are unsatisfied with our services and/or worried about your privacy you can 
                <Button className='delete-acc-link' onClick={handleDeleteAccount}>Delete your account</Button></p><br />
            </div>
        </div>
    )
}