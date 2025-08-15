// src/pages/Dashboard/index.js
import React, { useEffect, useState, useMemo } from "react";
import { fetchRooms } from "../../services/roomServices";
import { fetchBookings } from "../../services/bookingServices";
import { fetchMeetings } from "../../services/meetingServices";
import { fetchMoMs } from "../../services/momServices";
import { FaDoorClosed, FaCalendarCheck, FaUsers, FaFileExcel } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import ReportExport from "../../components/ReportExporter";
import "./dashboard.css";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [moMs, setMoMs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, bookingsData, meetingsData, moMsData] = await Promise.all([
          fetchRooms(),
          fetchBookings(),
          fetchMeetings(),
          fetchMoMs()
        ]);
        setRooms(roomsData);
        setBookings(bookingsData);
        setMeetings(meetingsData);
        setMoMs(moMsData);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Compute chart stats
  const stats = useMemo(() => {
    const meetingsByMonth = {};
    meetings.forEach(m => {
      const key = (m.date || "").slice(0, 7);
      meetingsByMonth[key] = (meetingsByMonth[key] || 0) + 1;
    });
    const meetingsData = Object.entries(meetingsByMonth).map(([month, count]) => ({ month, count }));

    const roomCount = {};
    bookings.forEach(b => {
      roomCount[b.roomId] = (roomCount[b.roomId] || 0) + 1;
    });
    const mostUsedData = Object.keys(roomCount).map(id => {
      const room = rooms.find(r => r.id === Number(id));
      return { name: room ? room.name : "Unknown", count: roomCount[id] };
    }).sort((a, b) => b.count - a.count);

    return { meetingsData, mostUsedData };
  }, [bookings, meetings, rooms]);

  // Prepare report data including MoM details
  const reportData = useMemo(() => {
    return meetings.map(m => {
      const mom = moMs.find(x => x.meetingId === m.id);
      return {
        Meeting: m.title || "Unknown",
        Date: m.date || "",
        Organizer: m.organizer || "Unknown",
        Room: rooms.find(r => r.id === m.bookingId)?.name || "Unknown",
        Attendees: m.attendees?.join(", ") || "",
        DiscussionPoints: mom?.discussionPoints?.join(" | ") || "",
        Decisions: mom?.decisions?.join(" | ") || "",
        ActionItems: mom?.actionItems?.map(ai => JSON.stringify(ai)).join(" | ") || ""
      };
    });
  }, [meetings, moMs, rooms]);

  if (loading) return <p className="muted">Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      {/* Cards */}
      <div className="cards">
        <div className="card">
          <div>
            <h3>Total Rooms</h3>
            <p>{rooms.length}</p>
          </div>
          <FaDoorClosed className="card-icon" />
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
          <div>
            <h3>Total Bookings</h3>
            <p>{bookings.length}</p>
          </div>
          <FaCalendarCheck className="card-icon" />
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}>
          <div>
            <h3>Total Meetings</h3>
            <p>{meetings.length}</p>
          </div>
          <FaUsers className="card-icon" />
        </div>
      </div>

      {/* Meetings by Month Chart */}
      <div style={{ marginTop: 18 }}>
        <h3>Meetings by Month</h3>
        {stats.meetingsData.length === 0 ? (
          <p className="muted">No meetings scheduled yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.meetingsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Most Used Rooms Chart */}
      <div style={{ marginTop: 18 }}>
        <h3>Most Used Rooms</h3>
        {stats.mostUsedData.length === 0 ? (
          <p className="muted">No bookings yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.mostUsedData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Report Export Button */}
      <div style={{ marginTop: 20 }}>
        <h3>Export Reports</h3>
        <ReportExport data={reportData} filename="meeting_report.xlsx">
          {({ onClick }) => (
            <button className="report-btn" onClick={onClick}>
              <FaFileExcel />
              Download Report
            </button>
          )}
        </ReportExport>
      </div>
    </div>
  );
}
