/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import { useParams } from "react-router-dom";
import apiFetch from "../../api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
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
        let t = new Array(...events);
        t.find(e => e.id === data.event.id).start = data.start;
        t.find(e => e.id === data.event.id).end = data.end;
        setEvents(t);

        console.log(data);
    };

    const onEventDrop = (data) => {
        console.log(data);
    };



    useEffect(() => {
        apiFetch(`availability/${businessType.substring(0, businessType.length - 1)}/allowed/period?id=${id}&dateFrom=${moment().format('YYYY-MM-DD')}&dateTo=${moment().add(1,'month').format('YYYY-MM-DD')}`).then(res => {
            setEvents(res.map(e => {
                return {
                    id: e.id,
                    start: moment(e.date + 'T' + e.timeFrom).toDate(),
                    end: moment(e.date + 'T' + e.timeTo).toDate(),
                    title: e.status,
                    style:{backgroundColor: 'green'}
                }
            }))
        }).catch(e => console.log('error', e));

        // console.log(moment().add(1,'month').format('YYYY-MM-DD'))

    }, [])


    return (
        <div className="main" style={{ padding: '5px' }}>
            <div className='block' style={{ height: 'calc(100vh - 180px)' }}>
                <DnDCalendar
                    defaultDate={moment().toDate()}
                    defaultView="week"
                    onDoubleClickEvent={() => alert('double')}
                    events={events}
                    localizer={localizer}
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    resizable
                    style={{ height: "calc(100vh - 240px)" }}
                />
            </div>

        </div>
    )
} 