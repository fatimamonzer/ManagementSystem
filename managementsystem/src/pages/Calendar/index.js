// src/pages/Calendar/index.js
import React, { useEffect, useState } from "react";
import { fetchRooms } from "../../services/roomServices";
import { fetchMeetings } from "../../services/meetingServices";
import "./calendar.css";

export default function Calendar() {
  const [rooms, setRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, meetingsData] = await Promise.all([
          fetchRooms(),
          fetchMeetings()
        ]);
        setRooms(roomsData);
        setMeetings(meetingsData);
      } catch (err) {
        console.error(err);
        alert("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Build calendar grid
  const generateCalendar = () => {
    const startDay = startOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = endOfMonth.getDate();

    const cells = [];
    let dayCounter = 1;

    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < startDay) || dayCounter > daysInMonth) {
          week.push(null);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }
      cells.push(week);
    }
    return cells;
  };

  const calendar = generateCalendar();

  const meetingsByDay = {};
  meetings.forEach(m => {
    const dateKey = new Date(m.date).toDateString();
    if (!meetingsByDay[dateKey]) meetingsByDay[dateKey] = [];
    meetingsByDay[dateKey].push({
      ...m,
      roomName: rooms.find(r => r.id === m.bookingId)?.name || "Unknown"
    });
  });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  if (loading) return <p className="muted">Loading calendar...</p>;

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt; Prev</button>
        <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <button onClick={nextMonth}>Next &gt;</button>
      </div>

      <div className="month-grid">
        <div className="week-days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="cell head">{day}</div>
          ))}
        </div>

        {calendar.map((week, i) => (
          <div key={i} className="week-row">
            {week.map((day, j) => {
              const dateKey = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() : null;
              return (
                <div key={j} className="cell">
                  {day && (
                    <>
                      <div className="day-num">{day}</div>
                      <div className="day-bookings">
                        {meetingsByDay[dateKey]?.map(m => (
                          <div key={m.id} className="booking-pill">
                            {m.title} ({m.roomName})
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="list-view" style={{ marginTop: 20 }}>
        <h3>All Meetings</h3>
        <ul>
          {meetings.map(m => (
            <li key={m.id}>
              <strong>{m.title}</strong> - {new Date(m.date).toLocaleDateString()} - {rooms.find(r => r.id === m.bookingId)?.name || "Unknown"} - Organizer: {m.organizer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
