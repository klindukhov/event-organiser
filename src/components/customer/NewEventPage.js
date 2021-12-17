import React, { useState } from 'react'
import '../../styles/customer/NewEventPage.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function NewEventPage(props) {
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('New event') }, []);
    const [cart, setCart] = useState({});
    // eslint-disable-next-line
    useEffect(() => { setCart(props.cart) }, [props.cart])
    const history = useHistory();

    const [isLocPicked, setIsLocPicked] = useState(false);
    // eslint-disable-next-line
    useEffect(() => { if (cart.locationDetails) { setIsLocPicked(true) } }, [cart])

    const [isCatPicked, setIsCatPicked] = useState(false);
    // eslint-disable-next-line
    useEffect(() => { if (cart.catering) { setIsCatPicked(true) } }, [cart])

    const [isServicePicked, setIsServicePicked] = useState(false);
    // eslint-disable-next-line
    useEffect(() => { if (cart.service) { setIsServicePicked(true) } }, [cart])

    const [newGuestPanel, setNewGuestPanel] = useState(false);
    const [guestList, setGuestList] = useState([]);

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')


    const addNewGuest = () => {
        setGuestList([
            ...guestList,
            {
                name: name,
                surname: surname,
                email: email
            }
        ]);
        setNewGuestPanel(false);
    }

    return (
        <div className='new-event-main'>
            <div className='venue-choice-rect'>
                <p className='venue-choice-heading'>Venue</p>
                {isLocPicked &&
                    <div className='venue-div'>
                        <div className='venue-pic-div'>
                            <img alt={props.cart.locationDetails.images[0].alt} src={props.cart.locationDetails.images[0].image} className='location-pic' />
                            <div className='venue-name-over'>{props.cart.locationDetails.name}
                            <input type='button' value='x' style={{color: 'white', backgroundColor:'transparent', borderColor:'transparent'}} onClick={() => {
                                props.setCatering(''); 
                                props.setService(''); 
                                props.setLocation(''); 
                                setIsCatPicked(false);
                                setIsServicePicked(false);
                                 setIsLocPicked(false);
                                 }}/></div>
                        </div>
                        <div className='venue-info-div'>
                            Date:<br />
                            Status:<br />
                            Catering:{' '}
                            {isCatPicked &&
                                <div>
                                    {props.cart.catering.name} <input type='button' style={{color: '#47525e', backgroundColor:'transparent', borderColor:'transparent'}} value='x' onClick={() => { props.setCatering(''); setIsCatPicked(false) }} />
                                </div>
                            }
                            {!isCatPicked &&
                                <input type='button' value='+' className='add-button' onClick={() => history.push('/CateringsPage')} />
                            }<br />
                            Services:{' '}
                            {isServicePicked &&
                                <div>
                                    {props.cart.service.type} <input type='button' value='x' style={{color: '#47525e', backgroundColor:'transparent', borderColor:'transparent'}} onClick={() => { props.setService(''); setIsServicePicked(false) }} />
                                </div>
                            }
                            {!isServicePicked &&
                                <input type='button' value='+' className='add-button' onClick={() => history.push('/ServicesPage')} />
                            }<br />
                        </div>
                    </div>
                }
                {!isLocPicked &&
                    <input type='button' value='+' className='add-button' onClick={() => history.push('/VenuesPage')} />
                }
            </div>
            <div className='guest-choice-rect'>
                <p className='guest-choice-heading'>Guests</p>
                {guestList.map(guest =>
                    <div className='guest-list-element'>
                        {guest.name} {guest.surname} {guest.email}
                    </div>
                )}
                {newGuestPanel &&
                    <div className='new-guest-panel'>
                        <input className='new-guest-input' placeholder='name' onChange={e => setName(e.target.value)} />
                        <input className='new-guest-input' placeholder='surname' onChange={e => setSurname(e.target.value)} />
                        <input className='new-guest-input' type='email' placeholder='email' onChange={e => setEmail(e.target.value)} />
                        <input className='new-guest-button' type='button' value='Add guest' onClick={addNewGuest} />
                    </div>
                }
                <input type='button' value='+' className='add-button' onClick={() => setNewGuestPanel(true)} />
            </div>
        </div>
    )
}