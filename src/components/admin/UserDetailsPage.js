import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../styles/admin/UserDetailsPage.css'

export default function UserDetailsPage() {
    const { id } = useParams();

    const [details, setDetails] = useState({});

    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/users?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(result => setDetails(result))
            .catch(error => console.log('error', error));

        // eslint-disable-next-line
    }, [])

    const handleVerify = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(`http://localhost:8080/api/business/verify?id=${id}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

            window.location.reload();

    }
    const handleBan = () => {

    }


    return (<div className="problem-details-main">
        <div className="problem-rect">
            <p className="problem-heading">User information</p>
            User id: {details.id}<br />
            User type: {details.type}<br />
            User email: {details.email}<br />
            User Name: {details.type === 'C' && details.customer.firstName} {details.type === 'B' && details.business.firstName}<br />
            User Surname: {details.type === 'C' && details.customer.lastName} {details.type === 'B' && details.business.lastName}<br />
            {details.type === 'C' && <>
                Birthdate: {details.customer.birthdate}<br />
                Phone number: {details.customer.phoneNumber}<br />
            </>
            }
            {details.type === 'B' && <>
                Business name: {details.business.businessName}<br />
                Phone number: {details.business.phoneNumber}<br />
                Verification: {details.business.verificationStatus} {details.business.verificationStatus !== 'VERIFIED' && <input type='button' className="verify-buttion" value='Mark verified' onClick={handleVerify} />}<br />
                Address: {details.business.address.streetName} {details.business.address.streetNumber}, {details.business.address.city}, {details.business.address.zipCode},  {details.business.address.country}
            </>}
            Active: {''+details.active} <input type='button' className="verify-buttion" value='Deactivate' onClick={handleBan} />
        </div>
        {details.type === 'C' &&
            <div className="reservations-heading-rect">
                <p className="problem-heading">Reservations</p>
            </div>}
    </div>)
}