// src/components/RescheduleModal.js
import React, { useState } from "react";

export default function RescheduleModal({ booking, onClose, onApply, existingBookings = [] }) {
  const [date, setDate] = useState(booking.date);
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);

  const handleApply = () => {
    onApply(booking.id, date, startTime, endTime);
  };

  return (
    <div style={{
      position:"fixed", inset:0, display:"flex", justifyContent:"center", alignItems:"center",
      background:"rgba(0,0,0,0.4)", zIndex:9999
    }}>
      <div style={{ background:"#fff", padding:20, borderRadius:8, width:360 }}>
        <h3>Reschedule Booking</h3>
        <p><strong>Room id:</strong> {booking.roomId}</p>
        <label>New Date</label>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        <label>Start Time</label>
        <input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
        <label>End Time</label>
        <input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />

        <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end", gap:8 }}>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleApply} className="btn-primary">Apply</button>
        </div>
      </div>
    </div>
  );
}
