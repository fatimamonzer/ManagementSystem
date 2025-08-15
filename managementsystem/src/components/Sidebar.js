import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ role }) {
  return (
    <nav className="sidebar">
      <h2>Meeting System</h2>
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms" className={({ isActive }) => (isActive ? "active" : "")}>
            Rooms
          </NavLink>
        </li>
        <li>
          <NavLink to="/bookings" className={({ isActive }) => (isActive ? "active" : "")}>
            Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/meetings" className={({ isActive }) => (isActive ? "active" : "")}>
            Meetings
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}>
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink to="/mom" className={({ isActive }) => (isActive ? "active" : "")}>
            MoM
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
            Notifications
          </NavLink>
        </li>
        <li>
            <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
                Reports
            </NavLink>
        </li>

        {role === "Admin" && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
              Admin Panel
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
