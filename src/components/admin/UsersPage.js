import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/admin/UsersPage.css'

export default function UsersPage(props) {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    // eslint-disable-next-line
    useEffect(() => { getAllUsers()}, [])
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Users')}, [])

    const getAllUsers = () => {
        apiFetch(`users/all`)
            .then(result => setUsers(result.items))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {users.map && users.map(user => <div className="user-list-element" key={user.id} onClick={() => history.push(`/UserDetailsPage${user.id}`)}>{"Id: " + user.id + '  Type: ' + user.type + "  Email: " + user.email}</div>)}

    </div>)
}