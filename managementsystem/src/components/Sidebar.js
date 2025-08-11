import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ role }) {
  return (
    <div className="sidebar">
      <h2>Meeting System</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/rooms">Rooms</Link></li>
        {role === "Admin" && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}
      </ul>
    </div>
  );
}
