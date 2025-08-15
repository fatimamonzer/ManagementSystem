import React, { useEffect, useState } from "react";
import { fetchBookings } from "../../services/bookingServices";
import { fetchMeetings, createMeeting } from "../../services/meetingServices";
import { getAllUsers } from "../../services/authServices";

export default function Meetings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: "",
    title: "",
    agenda: "",
    attendees: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsData, meetingsData, usersData] = await Promise.all([
          fetchBookings(),
          fetchMeetings(),
          getAllUsers() // fetch users dynamically
        ]);
        setBookings(bookingsData);
        setMeetings(meetingsData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAttendeesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, o => o.value);
    setFormData({ ...formData, attendees: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const meeting = await createMeeting(formData);
      setMeetings([...meetings, meeting]);
      setFormData({ bookingId: "", title: "", agenda: "", attendees: [] });
    } catch (err) {
      console.error(err);
      alert("Failed to schedule meeting");
    }
  };

  return (
    <div>
      <h1>Meeting Setup</h1>

      {user && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <select name="bookingId" value={formData.bookingId} onChange={handleChange} required>
            <option value="">Select Booking</option>
            {bookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.roomName} - {b.startTime.split("T")[0]} ({b.startTime.split("T")[1].slice(0,5)} to {b.endTime.split("T")[1].slice(0,5)})
              </option>
            ))}
          </select>

          <input type="text" name="title" placeholder="Meeting Title" value={formData.title} onChange={handleChange} required />
          <textarea name="agenda" placeholder="Meeting Agenda" value={formData.agenda} onChange={handleChange} required></textarea>

          <select multiple name="attendees" value={formData.attendees} onChange={handleAttendeesChange} required>
            {users.map(u => (
              <option key={u.id} value={u.username}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>

          <button type="submit">Schedule Meeting</button>
        </form>
      )}

      <h2>Scheduled Meetings</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Room</th>
            <th>Date</th>
            <th>Time</th>
            <th>Agenda</th>
            <th>Attendees</th>
            <th>Organizer</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map(m => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.roomName}</td>
              <td>{m.date}</td>
              <td>{m.startTime} - {m.endTime}</td>
              <td>{m.agenda}</td>
              <td>{m.attendees.join(", ")}</td>
              <td>{m.organizer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
