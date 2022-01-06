import React,{useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../../api";

export default function ProblemsPage(props){
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Problems')}, [])
    const [problems, setProblems] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getProblems()}, [])

    const getProblems = () => {
        apiFetch('problems?status=NOT_RESOLVED')
            .then(result => setProblems(result))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {problems.length === 0 && 'No unresolved problems'}
        {problems.map && problems.map(p => <div className="user-list-element" key={p.id} onClick={() => history.push(`/ProblemDetailsPage${p.id}`)}>{"Id: " + p.id + '  Concern: ' + p.concern}</div>)}

    </div>)
}