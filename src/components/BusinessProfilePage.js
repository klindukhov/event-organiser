import React, { useState } from 'react';
import '../styles/BusinessProfilePage.css';
import accIcon from '../images/accIcon250.png'
import { Link } from 'react-router-dom'

export default function BusinessProfilePage() {
    const [changes, setChanges] = useState(true);

    const handleInput = () => {
        setChanges(false);
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
                            <p className='business-profile-field-label'>Birthdate:</p>
                            <p className='business-profile-field-label'>Phone number:</p>
                            <p className='business-profile-field-label'>Email:</p>
                        </div>
                    </div>
                    <div className='business-profile-info-fields'>
                        <input className='business-profile-field-input' type='text' placeholder='business' onClick={handleInput} />
                        <input className='business-profile-field-input' type='text' placeholder='Johnny' onClick={handleInput} />
                        <input className='business-profile-field-input' type='date' placeholder='09/09/1979' onClick={handleInput} />
                        <input className='business-profile-field-input' type='text' placeholder='+1234567890' onClick={handleInput} />
                        <input className='business-profile-field-input' type='text' placeholder='business@ex.com' onClick={handleInput} />
                    </div>
                </div>
                <input type='button' className='submit-business-profile' value='Submit changes' disabled={changes} onClick={() => setChanges(true)}></input>
                <p className='change-password-p' >Change password</p>
                <div className='business-password-change'>
                    <input className='business-password-change-field' type='text' placeholder='New password'></input>
                    <input className='business-password-change-field' type='text' placeholder='Confirm password'></input>
                    <input className='business-password-submit-button' type='button' value='Change password'></input>

                </div>

                <p className='business-info-heading'>Business information
                <input className='request-verification' type='button' value="Request verification"></input>
                </p>

                <div className='business-info'>
                    <div className='business-info-labels'>
                        <p className='business-field-label'>Business name:</p>
                        <p className='business-field-label'>Country:</p>
                        <p className='business-field-label'>City:</p>
                        <p className='business-field-label'>Street:</p>
                        <p className='business-field-label'>Number:</p>
                    </div>
                    <div className='business-info-fields'>
                        <input className='business-field-input' type='text' placeholder='business' onClick={handleInput} />
                        <input className='business-field-input' type='text' placeholder='Poland' onClick={handleInput} />
                        <input className='business-field-input' type='text' placeholder='Warsaw' onClick={handleInput} />
                        <input className='business-field-input' type='text' placeholder='Al. Niepodleglosci' onClick={handleInput} />
                        <input className='business-field-input' type='text' placeholder='47' onClick={handleInput} />
                    </div>
                </div>

                <input type='button' className='submit-business-info' value='Submit changes' disabled={changes} onClick={() => setChanges(true)}></input>

                <p className='business-info-heading'>Images</p>

                <div className='images-rect'>
                    <img alt='restaurant-pic' className='restaurant-pic'></img>
                    <img alt='restaurant-pic' className='restaurant-pic'></img>

                    <input className='rest-img-add-button' type='button' value='+'></input>

                </div>

                <p className='business-prof-bottom-text' >If you are unsatisfied with our services and/or worried about about your privacy you can </p>
                <Link className='delete-acc-link' to=''>Delete your account</Link>

            </div>
        </div>
    )
}
