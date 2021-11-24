import React, { useState } from 'react';
import '../styles/CustomerProfilePage.css';
import accIcon from '../images/accIcon250.png'
import { Link } from 'react-router-dom'

export default function CustomerProfilePage() {
    const [changes, setChanges] = useState(true);

    const handleInput = () => {
        setChanges(false);
    }

    return (
        <div className='customer-profile-main'>
            <div className='customer-profile-rect'>

                <div className='customer-pic-and-info'>
                    <div className='customer-pic-and-labels'>
                        <img src={accIcon} alt='profile' className='customer-profile-image' />
                        <div className='customer-info-labels'>
                            <p className='customer-profile-field-label'>Name:</p>
                            <p className='customer-profile-field-label'>Surname:</p>
                            <p className='customer-profile-field-label'>Birthdate:</p>
                            <p className='customer-profile-field-label'>Phone number:</p>
                            <p className='customer-profile-field-label'>Email:</p>
                        </div>
                    </div>
                    <div className='customer-info-fields'>
                        <input className='customer-profile-field-input' type='text' placeholder='Customer' onClick={handleInput} />
                        <input className='customer-profile-field-input' type='text' placeholder='Johnny' onClick={handleInput} />
                        <input className='customer-profile-field-input' type='date' placeholder='09/09/1979' onClick={handleInput} />
                        <input className='customer-profile-field-input' type='text' placeholder='+1234567890' onClick={handleInput} />
                        <input className='customer-profile-field-input' type='text' placeholder='cust@ex.com' onClick={handleInput} />
                    </div>
                </div>
                <input type='button' className='submit-customer-profile' value='Submit changes' disabled={changes} onClick={() => setChanges(true)}></input>
                <p className='change-password-p' >Change password</p>
                <div className='customer-password-change'>
                    <input className='cust-password-change-field' type='text' placeholder='New password'></input>
                    <input className='cust-password-change-field' type='text' placeholder='Confirm password'></input>
                    <input className='cust-password-submit-button' type='button' value='Change password'></input>                    
                    
                </div>
                <p className='cust-prof-bottom-text' >If you are unsatisfied with our services and/or worried about about your privacy you can </p>
                <Link className='delete-acc-link' to=''>Delete your account</Link>
            </div>
        </div>
    )
}