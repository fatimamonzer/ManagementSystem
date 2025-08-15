// src/pages/Bookings/index.js
import React, { useEffect, useState } from "react";
import RescheduleModal from "../../components/RescheduleModal";
import NotificationToast from "../../components/NotificationToast";
import { fetchRooms } from "../../services/roomServices";
import { fetchBookings, createBooking, updateBooking, deleteBooking } from "../../services/bookingServices";
import { addNotification } from "../../services/notificationService";
import "./bookings.css";

export default function Bookings({ user }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ roomId: "", date: "", startTime: "", endTime: "" });
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Load rooms and bookings from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
      showToast("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isOverlap = (roomId, date, start, end, excludeId = null) => {
    return bookings.some(b =>
      b.roomId === Number(roomId) &&
      new Date(b.startTime).toISOString().startsWith(date) &&
      (!excludeId || b.id !== excludeId) &&
      !(end <= b.startTime.split("T")[1] || start >= b.endTime.split("T")[1])
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first.");
    if (!form.roomId || !form.date || !form.startTime || !form.endTime) return alert("Fill all fields.");

    if (isOverlap(form.roomId, form.date, form.startTime, form.endTime)) {
      return showToast("Room already booked for that slot.");
    }

    try {
      const start = new Date(`${form.date}T${form.startTime}`);
      const end = new Date(`${form.date}T${form.endTime}`);
      await createBooking({ roomId: Number(form.roomId), startTime: start, endTime: end });
      showToast("Booking created.");
      setForm({ roomId: "", date: "", startTime: "", endTime: "" });
      loadData();

      // Notifications
      const roomName = rooms.find(r => r.id === Number(form.roomId))?.name || "Unknown";
      addNotification({ to: "ROLE:Admin", type: "booking", title: "New booking", body: `${user.username} booked ${roomName}` });
    } catch (err) {
      console.error(err);
      showToast("Failed to create booking.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel booking?")) return;
    try {
      await deleteBooking(id);
      showToast("Booking cancelled.");
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel booking.");
    }
  };

  const openReschedule = (booking) => setRescheduleTarget(booking);
  const closeReschedule = () => setRescheduleTarget(null);

  const applyReschedule = async (id, newDate, newStart, newEnd) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    if (isOverlap(booking.roomId, newDate, newStart, newEnd, id)) {
      return showToast("Cannot reschedule: timeslot conflicts.");
    }

    try {
      const start = new Date(`${newDate}T${newStart}`);
      const end = new Date(`${newDate}T${newEnd}`);
      await updateBooking(id, { startTime: start, endTime: end });
      showToast("Booking rescheduled.");
      loadData();
      closeReschedule();
    } catch (err) {
      console.error(err);
      showToast("Failed to reschedule booking.");
    }
  };

  return (
    <div className="bookings-page">
      <h1>Bookings</h1>

      {toast && <NotificationToast message={toast} />}

      {user ? (
        <form className="booking-form" onSubmit={handleSubmit}>
          <select name="roomId" value={form.roomId} onChange={handleChange} required>
            <option value="">Select room</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (cap: {r.capacity})</option>)}
          </select>

          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />

          <button type="submit" className="btn-primary">Book Room</button>
        </form>
      ) : (
        <p>Please login to create bookings.</p>
      )}

      <h2>Upcoming Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Booked By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && <tr><td colSpan="6">No bookings</td></tr>}
              {bookings.map(b => {
                const room = rooms.find(r => r.id === b.roomId) || { name: "Unknown" };
                return (
                  <tr key={b.id}>
                    <td>{room.name}</td>
                    <td>{new Date(b.startTime).toISOString().split("T")[0]}</td>
                    <td>{new Date(b.startTime).toISOString().split("T")[1].slice(0,5)}</td>
                    <td>{new Date(b.endTime).toISOString().split("T")[1].slice(0,5)}</td>
                    <td>{b.bookedBy || "Unknown"}</td>
                    <td>
                      {(user?.username === b.bookedBy || user?.role === "Admin") ? (
                        <>
                          <button onClick={() => openReschedule(b)} className="btn-sm">Reschedule</button>
                          <button onClick={() => handleCancel(b.id)} className="btn-sm danger" style={{ marginLeft: 8 }}>Cancel</button>
                        </>
                      ) : <span>-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rescheduleTarget && (
        <RescheduleModal
          booking={rescheduleTarget}
          onClose={closeReschedule}
          onApply={applyReschedule}
          existingBookings={bookings}
        />
      )}
    </div>
  );
}
