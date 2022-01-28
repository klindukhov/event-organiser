import { Alert, Button, Snackbar } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import apiFetch from "../../api";
import "../../styles/general/ContactFormPage.css"

export default function ContactFormPage(props) {
    const [concern, setConcern] = useState('');
    const [concerns, setConcerns] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        apiFetch(`problems/types`)
            .then(result => setConcerns(result))
            .catch(error => console.log('error', error));
    }, [])
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSubmit = () => {
        const raw = JSON.stringify({ "concern": concern, "description": description });

        apiFetch(`problems?userId=${props.userId}`, "POST", raw).then(() => {
            setDescription('');
            setOpen(true);
        }).catch(error => console.log('error', error));
        


    }

    return (
        <div className='main'>
            <div className='contact-form-rect'>
                <p className='contact-form-heading'>Contact-form</p>

                <select className='problem-concern-input' onChange={(e) => setConcern(e.target.value)}>
                    <option value=''>Choose problem type</option>
                    {concerns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <textarea className='problem-description-input' placeholder='Detailed description of a problem' value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />
                <Button variant='contained' size='small' style={{ width: '250px', justifySelf: 'center' }} margin='dense' onClick={handleSubmit}>Submit</Button>
                <br />
                <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{vertical : 'bottom', horizontal: 'center'}} style={{position:'absolute', top:'500px', zIndex:'4'}} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        The form was submitted!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}