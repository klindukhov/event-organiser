import React, { useEffect, useState } from "react";
import apiFetch from "../../api";
import '../../styles/customer/GuestBookPage.css'

export default function GuestBook(props) {
    useEffect(() => { props.setHeaderMessage('Guest Book') })
    const [guests, setGuests] = useState([]);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');

    const handleAddGuest = () => {

        const raw = JSON.stringify({ "firstName": name, "lastName": surname, "email": email });

        apiFetch(`guests/new?customerId=${props.userId}`, "POST", raw)
            .catch(error => console.log('error', error));

        window.location.reload();

    }

    useEffect(() => {
        apiFetch(`guests/customer?customerId=${props.userId}`)
            .then(result => setGuests(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [props.userId])

    const deleteGuest = (id) => {
        apiFetch(`guests?customerId=${props.userId}&id=${id}`, "DELETE")
            .catch(error => console.log('error', error));

        window.location.reload();
    }

    return (
        <div className="main">
            {guests.map(guest => <div className="block" key={guest.id}>
                {guest.firstName + " " + guest.lastName + " (" + guest.email + ')'}
                <input type='button' value='Delete guest' className="delete-guest-button" onClick={() => deleteGuest(guest.id)} />
            </div>)}
            {guests.length === 0 &&
                <p>Your guest book is empty</p>
            }
            <div className="block">
                <input className="guest-listing-input" placeholder="Name" onChange={e => setName(e.target.value)} />
                <input className="guest-listing-input" placeholder="Surname" onChange={e => setSurname(e.target.value)} />
                <input className="guest-listing-input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input className="guest-listing-button" value='Add guest' type='button' onClick={handleAddGuest} />
            </div>

        </div>)
}