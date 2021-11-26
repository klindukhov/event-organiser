import React from "react";
import "../styles/ContactFormPage.css"

export default function ContactFormPage(){
    return(
        <div className='contact-form-main'>
            <div className='contact-form-rect'>
                <p className='contact-form-heading'>Contact-form</p>
                <select className='select-problem-type'>
                    <option value='select problem type'>select</option>
                    <option value='app problem'>App problem</option>
                    <option value='order problem'>Order problem</option>
                    <option value='reservation problem'>Reservation problem</option>
                </select>
                <input className='problem-description-input' type='text' placeholder='Describe the problem here'></input>
                <div className='problem-image-input'>
                    <img className='problem-pic' alt='problem-pic'/>
                    <img className='problem-pic' alt='problem-pic'/>
                    <input className='add-pic-button' type='button' value='+'/>
                </div>
                <input className='submit-problem-button' type='button' value='Submit'/>
            </div>
        </div>
    );
}