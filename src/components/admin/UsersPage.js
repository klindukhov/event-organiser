import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../../api";
import '../../styles/admin/UsersPage.css'
import { DataGrid, GridToolbar} from '@mui/x-data-grid'


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
    return (<div className="main" style={{ padding: '5px' }}>
        <DataGrid onRowDoubleClick={e => history.push(`/UserDetailsPage${e.id}`)} components={{ Toolbar: GridToolbar }} style={{ height: 'calc(100vh - 180px)', width: '1520px', backgroundColor: 'white' }}
            columns={[{ field: 'id' }, { field: 'type' }, { field: 'email', width: 250 }, { field: 'active' }, { field: 'createdAt', width: 200 }]}
            rows={users.map(p => { return { id: p.id, type: p.type, email: p.email, active: p.active, createdAt: p.createdAt} })}
        />
    </div>)
}