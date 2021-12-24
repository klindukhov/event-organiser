import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import '../../styles/admin/UsersPage.css'

export default function UsersPage(props) {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getAllUsers()}, [])
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Verification requests')}, [])

    const getAllUsers = () => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch("http://localhost:8080/api/business", requestOptions)
            .then(response => response.json())
            .then(result => setUsers(result.filter(u => u.verificationStatus!=="VERIFIED")))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {users.map(user => <div className="user-list-element" key={user.id} onClick={() => history.push(`/UserDetailsPage${user.id}`)}>{"Id: " + user.id + '  Name: ' + user.firstName + "  Surname: " + user.lastName}</div>)}
    </div>)
}