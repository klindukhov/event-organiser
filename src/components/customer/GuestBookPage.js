import React, { useEffect, useState } from "react";
import apiFetch from "../../api";
import '../../styles/customer/GuestBookPage.css'
import { TextField, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

export default function GuestBook(props) {
    useEffect(() => { props.setHeaderMessage('Guest Book') })
    const [guests, setGuests] = useState([]);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');

    const handleAddGuest = () => {

        const raw = JSON.stringify({ "firstName": name, "lastName": surname, "email": email });

        apiFetch(`guests/new?customerId=${props.userId}`, "POST", raw)
            .then(res => {
                if (res.ok) {
                    window.location.reload();
                }
            }).catch(error => console.log('error', error));
    }

    useEffect(() => {
        apiFetch(`guests/customer?customerId=${props.userId}`)
            .then(result => setGuests(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [props.userId])

    const deleteGuest = (id) => {
        apiFetch(`guests?customerId=${props.userId}&id=${id}`, "DELETE")
            .then(res => {
                window.location.reload();
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="main">
            {guests.map(guest => <div className="block" key={guest.id}>
                {guest.firstName + " " + guest.lastName + " (" + guest.email + ')'}
                <IconButton onClick={() => deleteGuest(guest.id)}>
                    <DeleteIcon />
                </IconButton>
            </div>)}
            {guests.length === 0 &&
                <p>Your guest book is empty</p>
            }
            <div className="block">
                <TextField size='small' style={{ width: '250px', marginRight: '20px' }} label="Name" onChange={e => setName(e.target.value)} />
                <TextField size='small' style={{ width: '250px', marginRight: '20px' }} label="Surname" onChange={e => setSurname(e.target.value)} />
                <TextField size='small' style={{ width: '250px', marginRight: '20px' }} label="Email" onChange={e => setEmail(e.target.value)} />
                <Button variant='contained' style={{ width: '250px', marginRight: '20px' }} value='Add guest' onClick={handleAddGuest}>Add guest</Button>
            </div>

        </div>)
}