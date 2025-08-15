import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import NotificationBell from "./components/NotificationBell";

import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Meetings from "./pages/Meetings";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import MoM from "./pages/MoM";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/Notifications";

// your additional routes import if needed, e.g. from settings/routes.js
import routes from "./settings/routes";
import Reports from "./pages/Reports";

function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Hide sidebar and header on login page "/"
  const showSidebar = location.pathname !== "/";
  const showHeader = location.pathname !== "/";

  // If user is not logged in and tries to access a protected page, redirect to login
  const isLoggedIn = !!user;
  const publicPaths = ["/"];
  if (!isLoggedIn && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {showSidebar && user && <Sidebar role={user.role} />}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {showHeader && user && (
          <header
            style={{
              height: 50,
              background: "#1e293b",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 20px",
              gap: 20,
              fontWeight: "600",
            }}
          >
            <NotificationBell user={user} />
            <span>{user.username}</span>
            <button
              onClick={() => setUser(null)}
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "1px solid white",
                color: "white",
                borderRadius: 4,
                padding: "4px 8px",
              }}
            >
              Logout
            </button>
          </header>
        )}

        <main style={{ flex: 1, overflowY: "auto", padding: 20, background: "#f8fafc" }}>
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/notifications" element={<NotificationsPage user={user} />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/rooms" element={<Rooms user={user} />} />
            <Route path="/bookings" element={<Bookings user={user} />} />
            <Route path="/meetings" element={<Meetings user={user} />} />
            <Route path="/calendar" element={<Calendar user={user} />} />
            <Route path="/mom" element={<MoM user={user} />} />
            <Route path="/reports" element={<Reports />} />
            {/* Additional routes from your settings/routes */}
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}

            {/* Redirect any unknown routes */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);
