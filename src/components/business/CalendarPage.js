/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css'; // import styles
import { useEffect, useState } from "react/cjs/react.development";
import { useParams } from "react-router-dom";
import apiFetch from "../../api";

export default function BusinessCalendar(props) {
    const { businessType } = useParams();
    const { id } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        apiFetch(`availability/${businessType.substring(0, businessType.length -1)}?id=${id}&date=?`).then(res => {console.log(res); setEvents('')}).catch(e => console.log('error', e));
    }, [])
    const [selectedView, setSelectedView] = useState();
    const onEventClick = () => {

    }
    const onNewEventClick = () => {
    }
    const onSelectView = (e) => {
        setSelectedView(e.target.value);

    }
    const onPageChange = () => {

    }

    return (
        <div className="main" style={{ padding: '5px' }}>
            <div className='block' style={{ height: 'calc(100vh - 180px)' }}>
                <Kalend
                    onEventClick={onEventClick}
                    onNewEventClick={onNewEventClick}
                    events={events}
                    initialDate={new Date().toISOString()}
                    hourHeight={60}
                    initialView={CalendarView.WEEK}
                    disabledViews={[CalendarView.DAY]}
                    onSelectView={onSelectView}
                    selectedView={selectedView}
                    onPageChange={onPageChange}
                    timeFormat={'24'}
                    weekDayStart={'Monday'}
                    calendarIDsHidden={['work']}
                    language={'en'}
                />
            </div>

        </div>
    )
} 