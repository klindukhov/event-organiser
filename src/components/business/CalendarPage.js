/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import { useParams } from "react-router-dom";
import apiFetch from "../../api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function BusinessCalendar(props) {
    const { businessType } = useParams();
    const { id } = useParams();
    const [events, setEvents] = useState([]);


    const onEventResize = (data) => {
        if (data.event.title !== 'BOOKED') {
            let raw = [{
                date: moment(data.start).format('YYYY-MM-DD'),
                timeFrom: moment(data.start).format('HH:mm:ss'),
                timeTo: moment(data.end).format('HH:mm:ss')
            }];

            events.forEach(e => {
                if (moment(e.start).format('YYYY-MM-DD') === moment(data.start).format('YYYY-MM-DD') && e.id !== data.event.id && e.title === "AVAILABLE") {
                    console.log(e)
                    console.log(data)
                    raw.push({
                        date: moment(e.start).format('YYYY-MM-DD'),
                        timeFrom: moment(e.start).format('HH:mm:ss'),
                        timeTo: moment(e.end).format('HH:mm:ss')
                    })
                }
            });

            apiFetch(`availability/${businessType.substring(0, businessType.length - 1)}?id=${id}`, "POST", JSON.stringify(raw))
                .then(() => { setBopen(true); getEvents(); })
                .catch(e => console.log('error', e))
        }
    };

    const getEvents = () => {
        apiFetch(`availability/${businessType.substring(0, businessType.length - 1)}/allowed/period?id=${id}&dateFrom=${moment().format('YYYY-MM-DD')}&dateTo=${moment().add(1, 'month').format('YYYY-MM-DD')}`)
            .then(res => {
                setEvents(res.map(e => {
                    return {
                        id: e.id,
                        start: moment(e.date + 'T' + e.timeFrom).toDate(),
                        end: moment(e.date + 'T' + e.timeTo).toDate(),
                        title: e.status === 'NOT_AVAILABLE' ? 'BOOKED' : e.status
                    }
                }))
                setBopen(false);
            }).catch(e => console.log('error', e));
    }


    useEffect(() => { getEvents() }, [])

    const [open, setOpen] = useState();
    const [bopen, setBopen] = useState();

    const handleClose = () => {
        setOpen(false);
    }

    const [dialogContent, setDialogContent] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogActions, setDialogActions] = useState('');
    const handleDeleteDialog = (data) => {
        if (data.title !== 'BOOKED') {
            setDialogTitle('Delete slot?');
            setDialogActions(<Button variant='contained' onClick={() => handleDelete(data.id)}>Delete</Button>)
            let { start, end } = data;
            setDialogContent(
                <>
                    <p>{moment(start).format('MMMM Do YYYY, h:mm a') + ' - ' + moment(end).format('MMMM Do YYYY, h:mm a')}</p>
                </>
            );
            setOpen(true);
            console.log(data)
        }
    }

    const handleDelete = (idDel) => {
        apiFetch(`availability/${businessType.substring(0, businessType.length - 1)}?id=${idDel}`, "DELETE")
            .then(() => {
                setOpen(false);
                setBopen(true);
                getEvents();
            })
            .catch(e => console.log('error', e));
    }

    const handleSelectSlot = (data) => {
        if (data.action === 'doubleClick' && !moment(data.start).fromNow().includes('ago')) {
            let raw = [{
                date: moment(data.start).format('YYYY-MM-DD'),
                timeFrom: moment(data.start).format('HH:mm:ss'),
                timeTo: moment(data.end).add(30, 'minute').format('HH:mm:ss')
            }];
            events.forEach(e => {
                if (moment(e.start).format('YYYY-MM-DD') === moment(data.start).format('YYYY-MM-DD') && e.title === "AVAILABLE") {
                    raw.push({
                        date: moment(e.start).format('YYYY-MM-DD'),
                        timeFrom: moment(e.start).format('HH:mm:ss'),
                        timeTo: moment(e.end).format('HH:mm:ss')
                    })
                }
            });

            apiFetch(`availability/${businessType.substring(0, businessType.length - 1)}?id=${id}`, "POST", JSON.stringify(raw))
                .then(() => { setBopen(true); getEvents(); })
                .catch(e => console.log('error', e))
        }
    }

    return (
        <div className="main" style={{ padding: '5px' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={bopen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    {dialogContent}
                </DialogContent>
                <DialogActions>
                    {dialogActions}
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='block' style={{ height: 'calc(100vh - 180px)' }}>
                <DnDCalendar
                    eventPropGetter={event => ({
                        style: {
                            backgroundColor: event.title === 'BOOKED'
                                ? "#f16868"
                                : "#9fcb6c",
                            fontSize: '16pt'
                        }
                    })}
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                    defaultDate={moment().toDate()}
                    defaultView="week"
                    onDoubleClickEvent={handleDeleteDialog}
                    events={events}
                    localizer={localizer}
                    onEventDrop={onEventResize}
                    onEventResize={onEventResize}
                    resizable
                    style={{ height: "calc(100vh - 240px)", fontSize:'12pt'}}
                />
            </div>

        </div>
    )
} 