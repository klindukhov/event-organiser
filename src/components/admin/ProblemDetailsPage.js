import { Button } from "@mui/material";
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
            <div className="problem-heading">Problem information</div>
            <span style={{fontSize:'12pt'}}>Problem id: </span>{details.id}<br />
            <span style={{fontSize:'12pt'}}>Created at: </span>{details.createdAt}<br />
            <span style={{fontSize:'12pt'}}>Concern: </span>"{details.concern}"<br />
            <span style={{fontSize:'12pt'}}>Description: </span>"{details.description}"<br />            
            <p className="problem-heading">User information <Button size='small' variant='contained'
            onClick={() => history.push(`/UserDetailsPage${details.user.id}`)}
            >User details</Button></p>
            <span style={{fontSize:'12pt'}}>User id: </span>{details.user && details.user.id}<br />
            <span style={{fontSize:'12pt'}}>User type: </span>{details.user && details.user.type}<br />
            <span style={{fontSize:'12pt'}}>User email: </span>{details.user && details.user.email}<br />
            <Button size='medium' variant='contained'  onClick={handleResolve}>Mark as resolved</Button>
        </div>
    </div>)
}