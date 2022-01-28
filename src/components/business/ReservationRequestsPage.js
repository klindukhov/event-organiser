import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiFetch from '../../api';
import '../../styles/business/ReservationRequestsPage.css'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'

export default function ReservationRequestsPage(props) {
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Reservation Requests') }, [])

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    const [bType, setBType] = useState('Services');
    const [iType, setIType] = useState('service');
    const [isRequests, setIsRequests] = useState(true);
    const handleEvents = (e) => {
        if (e.target.value === "Services") {
            setIType('service');
            setBType('Services')
        } else if (e.target.value === "Caterings") {
            setIType('catering')
            setBType('Caterings')
        } else if (e.target.value === "Venues") {
            setIType('location')
            setBType('Venues')
        } else if (e.target.value === "requests") {
            setIsRequests(true);
        } else if (e.target.value === "bookings") {
            setIsRequests(false);
        }
    }

    const [items, setItems] = useState([]);

    // eslint-disable-next-line
    useEffect(() => { getItems() }, [bType, isRequests])

    const getActions = i => {
        if (isRequests) {
            return (
                <>
                    <Button variant='contained' style={{ marginRight: '20px' }} onClick={() => handleConfirm(i)}>Confirm</Button>
                    <Button variant='contained' onClick={() => handleReject(i)}>Reject</Button>
                </>
            )
        }
    }

    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false) }
    const [orderContent, setOrderContent] = useState('');
    const [orderConfirmButton, setOrderConfirmButton] = useState('');

    const getOrder = i => {
        setOrderContent(
            <div style={{ width: '400px', height: '500px', overflow: 'auto' }}>
                {i.order.map(o => <ListItem>{o.amount + ' x ' + o.item.name}</ListItem>)}
                {i.order.length === 0 && "ⓘ No order has been made yet"}
            </div>
        );
        if (!i.isOrderConfirmed && i.order.length > 0 && !isRequests) {
            setOrderConfirmButton(
                <Button variant='contained' size='small' margin='dense' onClick={() => handleConfirmOrder(i.id)} >Confirm order</Button>
            )
        }

        return (<>
            <Button variant='contained' onClick={() => { setOpen(true) }}>Open order</Button>
        </>)
    }

    const getItems = () => {
        apiFetch(`event/${iType}/business/status?status=${isRequests ? 'NOT_CONFIRMED' : 'CONFIRMED'}&businessId=${props.userId}`)
            .then(res => {
                setItems(res);
                if (res.length > 0) {
                    switch (iType) {
                        case 'location':
                            setColumns([
                                { 'field': 'id' },
                                { 'field': 'Venue', renderCell: (params) => params.value },
                                { 'field': 'Date' },
                                { 'field': 'Time from' },
                                { 'field': 'Time to' },
                                { 'field': 'Guests' },
                                isRequests && { 'field': 'actions', renderCell: (params) => params.value, width: 200 }
                            ]);
                            setRows(res.map(e => {
                                return {
                                    id: e.id,
                                    venueId: e.location.id,
                                    Venue: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.location.name}</div></Tooltip>,
                                    Date: e.date,
                                    'Time from': e.timeFrom,
                                    'Time to': e.timeTo,
                                    Guests: e.guestCount,
                                    actions: getActions(e)
                                }
                            }));
                            break;
                        case 'catering':
                            setColumns([
                                { 'field': 'id' },
                                { 'field': 'Catering', renderCell: (params) => params.value },
                                { 'field': 'Date' },
                                { 'field': 'Time' },
                                { 'field': 'Guests' },
                                { 'field': 'Venue', renderCell: (params) => params.value },
                                { 'field': 'Comment', renderCell: (params) => params.value, width: 300 },
                                { 'field': isRequests ? 'actions' : 'Order status', renderCell: (params) => params.value, width: 200 },
                                !isRequests && { 'field': 'Order', renderCell: (params) => params.value, width: 200 }
                            ]);
                            setRows(res.map(e => {
                                return {
                                    id: e.id,
                                    venueId: e.catering.id,
                                    locationId: e.eventLocation.location.id,
                                    Catering: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.catering.name}</div></Tooltip>,
                                    Date: e.eventLocation.date,
                                    Guests: e.eventLocation.guestCount,
                                    Comment: <Tooltip placement='bottom-start' title={e.comment}><div>{e.comment}</div></Tooltip>,
                                    'Time': e.time,
                                    Venue: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.eventLocation.location.name}</div></Tooltip>,
                                    actions: getActions(e),
                                    Order: getOrder(e),
                                    'Order status': e.isOrderConfirmed ? 'Confirmed' : 'Not confirmed'
                                }
                            }));
                            break;
                        case 'service':
                            setColumns([
                                { 'field': 'id', width: 50 },
                                { 'field': 'Service', renderCell: (params) => params.value },
                                { 'field': 'Alias', renderCell: (params) => params.value },
                                { 'field': 'Name', renderCell: (params) => params.value },
                                { 'field': 'Surname', renderCell: (params) => params.value },
                                { 'field': 'Comment', renderCell: (params) => params.value, width: 200 },
                                { 'field': 'Venue', renderCell: (params) => params.value },
                                { 'field': 'Date' },
                                { 'field': 'Time from' },
                                { 'field': 'Time to' },
                                { 'field': 'Guests' },
                                isRequests && { 'field': 'actions', renderCell: (params) => params.value, width: 200 }]);
                            setRows(res.map(e => {
                                return {
                                    id: '3  ',
                                    venueId: e.optionalService.id,
                                    locationId: e.locationForEvent.location.id,
                                    Service: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.optionalService.type}</div></Tooltip>,
                                    Alias: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.optionalService.alias}</div></Tooltip>,
                                    Name: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.optionalService.firstName}</div></Tooltip>,
                                    Surname: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.optionalService.lastName}</div></Tooltip>,
                                    Comment: <Tooltip placement='bottom-start' title={e.comment}><div>{e.comment}</div></Tooltip>,
                                    Date: e.locationForEvent.date,
                                    'Time from': e.timeFrom,
                                    'Time to': e.timeFrom,
                                    Venue: <Tooltip style={{ cursor: 'pointer' }} placement='bottom-start' title='details'><div>{e.locationForEvent.location.name}</div></Tooltip>,
                                    Guests: e.locationForEvent.guestCount,
                                    actions: getActions(e)
                                }
                            }));
                            break;
                        default:
                            break;
                    }
                } else {
                    setColumns([]);
                    setRows([]);
                }
            }).catch(e => console.log('error', e));
    }
    useEffect(() => { console.log(items) }, [items])

    const handleConfirm = (i) => {
        apiFetch(`event/${iType}/confirm?${iType === 'catering' ? 'cateringI' : 'i'}d=${bType === "Services" ? i.optionalService.id : i[iType].id}&eventId=${bType === 'Venues' ? i.event.id : bType === 'Caterings' ? i.eventLocation.event.id : i.locationForEvent.event.id}`, "PUT").then(() => window.location.reload()).catch(e => console.log('error', e))
    }

    const handleReject = (i) => {
        apiFetch(`event/${iType}/cancel?id=${i.id}`, "DELETE").then(res => res.json()).then(res => window.location.reload()).catch(e => console.log('error', e))
    }

    const handleConfirmOrder = (id) => {
        apiFetch(`event/catering/order/confirm?reservationId=${id}`, "PUT").then(res => window.location.reload()).catch(e => console.log("error", e));
    }

    const handleCellClick = e => {
        if (e.field === bType.substring(0, bType.length - 1) || e.field === 'Alias' || e.field === 'Name' || e.field === 'Surname') {
            history.push(`/ItemDetails/${bType.substring(0, bType.length - 1)}/${e.row.venueId}`)
        }
        if (e.field === 'Venue' && bType !== 'Venues') {
            history.push(`/ItemDetails/Venue/${e.row.locationId}`)
        }
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <ToggleButtonGroup value={bType} size='small' style={{ marginRight: '20px' }} onChange={handleEvents}>
                    <ToggleButton style={{ width: '100px' }} value='Caterings'>Caterings</ToggleButton>
                    <ToggleButton style={{ width: '100px' }} value='Services'>Services</ToggleButton>
                    <ToggleButton style={{ width: '100px' }} value='Venues'>Venues</ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup value={isRequests ? 'requests' : 'bookings'} size='small' onChange={handleEvents}>
                    <ToggleButton style={{ width: '100px' }} value={'requests'}>Requests</ToggleButton>
                    <ToggleButton style={{ width: '100px' }} value={'bookings'}>Bookings</ToggleButton>
                </ToggleButtonGroup>

            </GridToolbarContainer>
        );
    }

    return (<div className='main' style={{padding:'5px'}}>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Order"}
            </DialogTitle>
            <DialogContent>
                {orderContent}
            </DialogContent>
            <DialogActions>
                {orderConfirmButton}
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <DataGrid
            components={{ Toolbar: CustomToolbar }}
            onCellDoubleClick={handleCellClick}
            style={{ height: 'calc(100vh - 180px)', width: '1520px', backgroundColor: 'white' }}
            columns={columns}
            rows={rows}
        />
    </div>)
}

