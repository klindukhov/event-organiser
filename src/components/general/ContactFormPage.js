import { Button } from "@mui/material";
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

    const handleSubmit = () => {
        const raw = JSON.stringify({ "concern": concern, "description": description });

        apiFetch(`problems?userId=${props.userId}`, "POST", raw).then(() => {
            props.togglePopup(<div>
                The form was submitted<br />
                <Button className='button' onClick={() => window.location.reload()}>ok</Button>
            </div>);
        }).catch(error => console.log('error', error));



    }

    return (
        <div className='contact-form-main'>
            <div className='contact-form-rect'>
                <p className='contact-form-heading'>Contact-form</p>

                <select className='problem-concern-input' onChange={(e) => setConcern(e.target.value)}>
                    <option value=''>Choose problem type</option>
                    {concerns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <textarea className='problem-description-input' placeholder='Detailed description of a problem' onChange={(e) => setDescription(e.target.value)} />
                <br/>
                <Button variant='contained' size='small' style={{width:'250px', justifySelf: 'center'}} margin='dense' onClick={handleSubmit}>Submit</Button>
                <br/>
            </div>
        </div>
    );
}