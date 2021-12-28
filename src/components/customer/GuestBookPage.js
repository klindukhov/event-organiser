import React, { useEffect, useState } from "react";
import '../../styles/customer/GuestBookPage.css'

export default function GuestBook(props) {
    useEffect(() => { props.setHeaderMessage('Guest Book') })
    const [guests, setGuests] = useState([]);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');

    const handleAddGuest = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "firstName": name, "lastName": surname, "email": email });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/guests/new?customerId=${props.userId}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        window.location.reload();

    }

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/guests/customer?customerId=${props.userId}`, requestOptions)
            .then(response => response.json())
            .then(result => setGuests(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [props.userId])

    const deleteGuest = (id) => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/guests?customerId=${props.userId}&id=${id}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
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