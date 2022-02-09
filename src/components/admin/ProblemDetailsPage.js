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
            Problem id:<span style={{ fontWeight: 'lighter' }}> {details.id}<br /></span>
            Created at:<span style={{ fontWeight: 'lighter' }}> {details.createdAt}<br /></span>
            Concern:<span style={{ fontWeight: 'lighter' }}> "{details.concern}"<br /></span>
            Description:<span style={{ fontWeight: 'lighter' }}> "{details.description}"<br />  </span>
            <p className="problem-heading"><Button size='medium' variant='outlined'
                onClick={() => history.push(`/UserDetailsPage${details.user.id}`)}
            >User Information</Button></p>
            User id:<span style={{ fontWeight: 'lighter' }}> {details.user && details.user.id}<br /></span>
            User type:<span style={{ fontWeight: 'lighter' }}> {details.user && details.user.type}<br /></span>
            User email:<span style={{ fontWeight: 'lighter' }}> {details.user && details.user.email}<br /></span>
            <p style={{textAlign: 'center'}}>
                <Button size='medium' variant='contained' onClick={handleResolve}>Mark as resolved</Button>
            </p>
        </div>
    </div>)
}