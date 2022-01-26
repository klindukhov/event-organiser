import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../../api";

export default function ProblemsPage(props) {
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Problem reports') }, [])
    const [problems, setProblems] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getProblems() }, [])

    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');

    const getProblems = () => {
        apiFetch('problems?status=NOT_RESOLVED')
            .then(result => setProblems(result))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {problems.length === 0 && 'No unresolved problems'}
        {problems.length !== 0 && <div className="user-list-element" >
            <TextField type='date' label='Date from' InputLabelProps={{ shrink: true }} size='small' onChange={e => setTimeFrom(e.target.value)} /> - <TextField label='Date to' size='small' InputLabelProps={{ shrink: true }} type='date' onChange={e => setTimeTo(e.target.value)} />
            : <a href={`http://localhost:8080/api/problems/export?dateFrom=${timeFrom === '' ? '2022-01-01' : timeFrom}&dateTo=${timeTo === '' ? '2022-01-01' : timeTo}`} download >Download report</a>
        </div>}
        {problems.map && problems.map(p => <div className="user-list-element" style={{ cursor: 'pointer' }} key={p.id} onClick={() => history.push(`/ProblemDetailsPage${p.id}`)}>
            <span style={{fontSize:'12pt'}}>
                Id:
            </span> {p.id}{'  '}
            <span style={{fontSize:'12pt'}}>
                Concern:
            </span> {p.concern}
        </div>)}

    </div>)
}