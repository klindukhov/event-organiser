import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/admin/ProblemDetailsPage.css'

export default function ProblemDetailsPage() {
    const { id } = useParams();
    const history = useHistory();

    const [details, setDetails] = useState({});
    useEffect(() => {
        apiFetch(`problems?id=${id}`)
            .then(result => setDetails(result))
            .catch(error => console.log('error', error));
        // eslint-disable-next-line
    }, [])

    const handleResolve = () => {
        apiFetch(`problems?id=${id}`, 'PUT')
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        history.push('/ProblemsPage');
        window.location.reload();
    }

    return (<div className="problem-details-main">
        <div className="problem-rect">
            <p className="problem-heading">Problem information</p>
            Problem id: {details.id}<br />
            Concern: "{details.concern}"<br />
            Description:<br />
            "{details.description}"
            <p className="problem-heading">User information</p>
            User id: {details.user && details.user.id}<br />
            User type: {details.user && details.user.type}<br />
            User email: {details.user && details.user.email}<br />

            <input type='button' className='resolve-problem-button' value='Mark as resolved' onClick={handleResolve} />
        </div>
    </div>)
}