import React,{useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

export default function ProblemsPage(props){
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Problems')}, [])
    const [problems, setProblems] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getProblems()}, [])

    const getProblems = () => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch("http://localhost:8080/api/problems?status=NOT_RESOLVED", requestOptions)
            .then(response => response.json())
            .then(result => setProblems(result))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {problems.map(p => <div className="user-list-element" key={p.id} onClick={() => history.push(`/ProblemDetailsPage${p.id}`)}>{"Id: " + p.id + '  Concern: ' + p.concern}</div>)}

    </div>)
}