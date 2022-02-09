import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../../api";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid'
import { FileDownload, FileDownloadOutlined } from "@mui/icons-material";

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

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    function CustomToolbar() {
        return (
                <GridToolbarContainer>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />
                    <Button onClick={handleClickOpen} size='small'><FileDownloadOutlined />Export</Button>

                </GridToolbarContainer>
        );
    }

    return (<div className="main" style={{ padding: '5px' }}>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Choose time frame"}
            </DialogTitle>
            <DialogContent>
                <br />
                <TextField type='date' label='Date from' InputLabelProps={{ shrink: true }} size='small'
                    value={timeFrom} onChange={e => setTimeFrom(e.target.value)} />
                {' _ '}
                <TextField label='Date to' size='small' InputLabelProps={{ shrink: true }} type='date'
                    value={timeTo} onChange={e => setTimeTo(e.target.value)} />
                <a href={`http://localhost:8080/api/problems/export?dateFrom=${timeFrom === '' ? '2022-01-01' : timeFrom}&dateTo=${timeTo === '' ? '2022-01-01' : timeTo}`} download >
                    <Tooltip title="Download report"><FileDownload /></Tooltip>
                </a>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        {problems.length === 0 && 'No unresolved problems'}
        <DataGrid onRowDoubleClick={e => history.push(`/ProblemDetailsPage${e.id}`)} components={{ Toolbar: CustomToolbar, }} style={{ height: 'calc(100vh - 180px)', width: '1520px', backgroundColor: 'white' }}
            columns={[{ field: 'id' }, { field: 'userId' }, { field: 'concern', width: 200 }, { field: 'date', width: 200 }, { field: 'description', width: 500 }]}
            rows={problems.map(p => { return { id: p.id, userId: p.user.id, concern: p.concern, date: p.createdAt, description: p.description } })}
        />

    </div>)
}