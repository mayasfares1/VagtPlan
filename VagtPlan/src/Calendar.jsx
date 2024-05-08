import React, { useState } from "react";
import { SevenColGrid, Wrapper, HeadDays, DateControls, StyledEvent, PortalWrapper } from "./Calendar_styled.jsx";
import { DAYS, MOCKAPPS } from "./conts.jsx";
import { datesAreOnSameDay, getDarkColor, getDaysInMonth, getMonthYear, nextMonth, prevMonth } from "./utils.jsx";

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));
    const [events, setEvents] = useState(MOCKAPPS);
    const [showPortal, setShowPortal] = useState(false);
    const [portalData, setPortalData] = useState({});
    const [error, setError] = useState(null);

    const handleEventClick = (event) => {
        if (event) {
            setShowPortal(true);
            setPortalData(event);
        } else {
            setError('Failed to load event data.');
        }
    };

    const handleEventDelete = (eventTitle) => {
        if (!eventTitle) {
            setError('Invalid event title for deletion.');
            return;
        }
        const updatedEvents = events.filter(event => event.title !== eventTitle);
        if (updatedEvents.length === events.length) {
            setError('No event found to delete.');
            return;
        }
        setEvents(updatedEvents);
        setShowPortal(false);
    };

    const handleEventEdit = (event) => {
        if (!event || !event.title) {
            setError('Invalid event data for editing.');
            return;
        }
        const newTitle = prompt("Edit the event name", event.title);
        if (!newTitle) {
            setError('No new title provided. Event not updated.');
            return;
        }
        setEvents(events.map(ev => ev.title === event.title ? { ...ev, title: newTitle } : ev));
        setShowPortal(false);
    };

    const handleDayClick = (date) => {
        if (!date) {
            setError('Invalid date for adding a new event.');
            return;
        }
        const shiftName = prompt("Enter the name of the shift:", "");
        if (!shiftName) {
            setError('Shift name is required.');
            return;
        }

        const startTime = prompt("Enter the start time of the shift (HH:MM):", "12:00");
        const endTime = prompt("Enter the end time of the shift (HH:MM):", "14:30");
        if (!startTime || !endTime) {
            setError('Both start and end times are required.');
            return;
        }

        const newEvent = {
            date,
            title: shiftName,
            startTime,
            endTime,
            color: getDarkColor(),
        };

        setEvents(currentEvents => [...currentEvents, newEvent]);
    };

    return (
        <Wrapper>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <DateControls>
                <ion-icon onClick={() => setCurrentDate(prevMonth(currentDate))} name="arrow-back-circle-outline"></ion-icon>
                {getMonthYear(currentDate)}
                <ion-icon onClick={() => setCurrentDate(nextMonth(currentDate))} name="arrow-forward-circle-outline"></ion-icon>
            </DateControls>
            <SevenColGrid>
                {DAYS.map((day) => (
                    <HeadDays key={day}>{day}</HeadDays>
                ))}
                {[...Array(getDaysInMonth(currentDate))].map((_, index) => (
                    <div key={index} onClick={() => handleDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1))}>
                        <span className={datesAreOnSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)) ? "active" : ""}>
                            {index + 1}
                        </span>
                        {events.filter(e => datesAreOnSameDay(e.date, new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1))).map(event => (
                            <StyledEvent key={event.title} bgColor={event.color} onClick={() => handleEventClick(event)}>
                                {event.title}: {event.startTime} - {event.endTime} ({calculateDuration(event.startTime, event.endTime)})
                                <button onClick={() => handleEventDelete(event.title)}>Delete</button>
                                <button onClick={() => handleEventEdit(event)}>Edit</button>
                            </StyledEvent>
                        ))}
                    </div>
                ))}
            </SevenColGrid>
            {showPortal && (
                <PortalWrapper>
                    <h2>{portalData.title}</h2>
                    <p>{portalData.date ? portalData.date.toDateString() : 'No Date'}</p>
                    <button onClick={() => handleEventDelete(portalData.title)}>Delete</button>
                    <button onClick={() => handleEventEdit(portalData)}>Edit</button>
                </PortalWrapper>
            )}
        </Wrapper>
    );
};

const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return 'Invalid times'; // Properly handle the case when time input is invalid
    }
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) {
        return 'End time must be after start time'; // Check for logical errors in time inputs
    }
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}min`;
};
