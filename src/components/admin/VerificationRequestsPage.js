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
    useEffect(() => { props.setHeaderMessage('Verification requests')}, [])

    const getAllUsers = () => {
        apiFetch(`business`)
            .then(result => setUsers(result.filter(u => u.verificationStatus!=="VERIFIED")))
            .catch(error => console.log('error', error));
    }
    return (<div className="users-page-main">
        {users.length === 0 && 'No verification requests'}
        {users.map(user => <div className="user-list-element" key={user.id} onClick={() => history.push(`/UserDetailsPage${user.id}`)}>{"Id: " + user.id + '  Name: ' + user.firstName + "  Surname: " + user.lastName}</div>)}
    </div>)
}