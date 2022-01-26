import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiFetch from '../../api';
import '../../styles/business/ReservationRequestsPage.css'
import { Accordion, AccordionDetails, AccordionSummary, Button, ListItem, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export default function ReservationRequestsPage(props) {
    const history = useHistory();
    // eslint-disable-next-line
    useEffect(() => { props.setHeaderMessage('Reservation Requests') }, [])

    const [bType, setBType] = useState('Services');
    const [iType, setIType] = useState('service');
    const [isRequests, setIsRequests] = useState(true);

    const [eventPastColor, setEventPastColor] = useState('#47525e');
    const [eventFutureColor, setEventFutureColor] = useState('#47525e');
    const [bookingsColor, setBookingsColor] = useState('#47525e');
    const [eventAllColor, setEventAllColor] = useState('white');
    const [requestsColor, setRequestsColor] = useState('white');
    const [eventPastBackColor, setEventPastBackColor] = useState('#F2F4F5');
    const [eventFutureBackColor, setEventFutureBackColor] = useState('#F2F4F5');
    const [bookingsBackColor, setBookingsBackColor] = useState('#F2F4F5');
    const [eventAllBackColor, setEventAllBackrColor] = useState('#47525e');
    const [requestsBackColor, setRequestsBackColor] = useState('#47525e');
    const handleEvents = (e) => {
        if (e.target.value === "Services") {
            setEventPastColor('#47525e');
            setEventFutureColor('#47525e');
            setEventAllColor('white');
            setEventPastBackColor('#F2F4F5');
            setEventFutureBackColor('#F2F4F5');
            setEventAllBackrColor('#47525e');
            setIType('service');
            setBType('Services')
        } else if (e.target.value === "Caterings") {
            setEventPastColor('white');
            setEventFutureColor('#47525e');
            setEventAllColor('#47525e');
            setEventPastBackColor('#47525e');
            setEventFutureBackColor('#F2F4F5');
            setEventAllBackrColor("#F2F4F5");
            setIType('catering')
            setBType('Caterings')
        } else if (e.target.value === "Venues") {
            setEventPastColor('#47525e');
            setEventFutureColor('white');
            setEventAllColor('#47525e');
            setEventPastBackColor('#F2F4F5');
            setEventFutureBackColor('#47525e');
            setEventAllBackrColor('#F2F4F5');
            setIType('location')
            setBType('Venues')
        } else if (e.target.value === "requests") {
            setRequestsColor('white');
            setRequestsBackColor('#47525e')
            setBookingsBackColor('#F2F4F5')
            setBookingsColor('#47525e')
            setIsRequests(true);
        } else if (e.target.value === "bookings") {
            setRequestsColor('#47525e');
            setRequestsBackColor('#F2F4F5')
            setBookingsBackColor('#47525e')
            setBookingsColor('white')
            setIsRequests(false);
        }
    }

    const [items, setItems] = useState([]);

    // eslint-disable-next-line
    useEffect(() => { getItems() }, [bType, isRequests])

    const getItems = () => {
        apiFetch(`event/${iType}/business/status?status=${isRequests ? 'NOT_CONFIRMED' : 'CONFIRMED'}&businessId=${props.userId}`)
            .then(res => setItems(res)).catch(e => console.log('error', e));
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

    return (<div className='main'>
        <div className='block' style={{ textAlign: 'center' }}>
            <Button className='e-c-button-l' value='Caterings' onClick={handleEvents} style={{ color: eventPastColor, backgroundColor: eventPastBackColor }}>Caterings</Button>
            <Button className='e-c-button-c' value='Services' onClick={handleEvents} style={{ color: eventAllColor, backgroundColor: eventAllBackColor }}>Services</Button>
            <Button className='e-c-button-r' value='Venues' onClick={handleEvents} style={{ color: eventFutureColor, backgroundColor: eventFutureBackColor }}>Venues</Button>
            <br />
            <br />
            <Button className='e-c-button-l' value='requests' onClick={handleEvents} style={{ color: requestsColor, backgroundColor: requestsBackColor }}>requests</Button>
            <Button className='e-c-button-r' value='bookings' onClick={handleEvents} style={{ color: bookingsColor, backgroundColor: bookingsBackColor }}>bookings</Button>
        </div>

        {items && items.length > 0 && items.map(i =>
            <div className='block' key={i.id}>
                {isRequests ? 'REQUEST:' : 'BOOKING:'} {i.id}<br />
                {bType.substring(0, bType.length - 1)}: {i[iType] && i[iType].name} {bType === 'Services' && i.optionalService && i.optionalService.firstName + i.optionalService.firstName} <Button
                    variant='contained'
                    onClick={() => history.push(`/ItemDetails/${bType.substring(0, bType.length - 1)}/${bType === 'Services' ? i.optionalService.id : i[iType].id}`)}>{`${bType.substring(0, bType.length - 1)} details`}</Button>
                <br />
                {bType === 'Venues' && <>
                    Date: {i.date} ({i.timeFrom}-{i.timeTo})<br />
                    Guests: {i.guestCount}<br />
                </>}
                {bType === 'Services' && i.locationForEvent && <>
                    Date: {i.locationForEvent.date} ({i.timeFrom}-{i.timeTo})<br />
                    Comment:
                    "{i.comment}"<br />
                </>}
                {bType === 'Caterings' && <>
                    Time: {i.time}<br />
                    Comment:
                    "{i.comment}"<br />
                    {!isRequests && <Accordion style={{ width: '300px' }} margin='dense'>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Order </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {i.order && i.order.map(o => <ListItem>{o.amount + ' x ' + o.item.name}</ListItem>)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>}
                    {!i.isOrderConfirmed && !isRequests && <Button variant='contained' size='small' margin='dense' onClick={() => handleConfirmOrder(i.id)} >Confirm order</Button>}
                </>}
                {isRequests && <Button variant='contained' onClick={() => handleConfirm(i)}>Confirm</Button>}{" "}
                {isRequests && <Button variant='contained' onClick={() => handleReject(i)}>Reject</Button>}

            </div>)
        }


    </div>)
}

