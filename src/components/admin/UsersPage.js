import React, { useEffect, useState } from "react";
import '../../styles/admin/UsersPage.css'

export default function UsersPage(props) {
    const [users, setUsers] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getAllUsers()}, [])
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Users')}, [])

    const getAllUsers = () => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch("http://localhost:8080/api/users/all", requestOptions)
            .then(response => response.json())
            .then(result => setUsers(result))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {users.map(user => <div className="user-list-element" key={user.id}>{"Id: " + user.id + '  Type: ' + user.type + "  Email: " + user.email}</div>)}

    </div>)
}