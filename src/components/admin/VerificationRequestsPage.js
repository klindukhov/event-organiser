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
    useEffect(() => { props.setHeaderMessage('Verification requests')}, [])

    const getAllUsers = () => {
        apiFetch(`business`)
            .then(result => setUsers(result.filter(u => u.verificationStatus!=="VERIFIED")))
            .catch(error => console.log('error', error));
    }
    return (<div className="main" style={{ padding: '5px' }}>
        {users.length === 0 && 'No verification requests'}
        <DataGrid onRowDoubleClick={e => history.push(`/UserDetailsPage${e.id}`)} components={{ Toolbar: GridToolbar }} style={{ height: 'calc(100vh - 180px)', width: '1520px', backgroundColor: 'white' }}
            columns={[{ field: 'id' }, { field: 'name', width: 150 }, { field: 'surname', width: 150 }, { field: 'businessName', width: 150 },{ field: 'phoneNumber', width: 250 }]}
            rows={users.map(p => { return { id: p.id, name: p.firstName, surname: p.lastName, businessName: p.businessName, phoneNumber: p.phoneNumber} })}
        />
    </div>)
}