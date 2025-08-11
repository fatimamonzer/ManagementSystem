import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import routes from "./settings/routes";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";

function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const showSidebar = location.pathname !== "/";

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && user && <Sidebar role={user.role} />}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/rooms" element={<Rooms user={user} />} />
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
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
