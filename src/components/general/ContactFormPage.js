import React from "react";
import { useState } from "react/cjs/react.development";
import "../../styles/general/ContactFormPage.css"

export default function ContactFormPage(props) {
    const [concern, setConcern] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "concern": concern, "description": description });

        var requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            
        };

        fetch(`http://localhost:8080/api/problems?userId=${props.userId}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    return (
        <div className='contact-form-main'>
            <div className='contact-form-rect'>
                <p className='contact-form-heading'>Contact-form</p>
                
                <input className='problem-concern-input' type='text' placeholder='Short description of a problem' onChange={(e) => setConcern(e.target.value)}/>
                <textarea className='problem-description-input'  placeholder='Detailed description of a problem' onChange={(e) => setDescription(e.target.value)}/>
                
                <input className='submit-problem-button' type='button' value='Submit' onClick={handleSubmit} />
            </div>
        </div>
    );
}