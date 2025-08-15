// src/components/NotificationBell.js
import React, { useEffect, useState } from "react";
import { countUnread, getNotificationsForUser, markRead, deleteNotification, markAllReadForUser } from "../services/notificationService";
import { Link } from "react-router-dom";

export default function NotificationBell({ user }) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      setItems([]);
      return;
    }
    refresh();
    // small interval poll so other pages' actions show notifications quickly (frontend-only)
    const t = setInterval(() => refresh(), 2500);
    return () => clearInterval(t);
  }, [user]);

  function refresh() {
    const u = user?.username;
    setUnread(countUnread(u));
    setItems(getNotificationsForUser(u).slice(0, 6)); // show latest 6
  }

  const handleMarkRead = (id) => {
    markRead(id);
    refresh();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete notification?")) return;
    deleteNotification(id);
    refresh();
  };

  const handleMarkAll = () => {
    markAllReadForUser(user.username);
    refresh();
  };

  return (
    <div style={{ position: "relative", marginLeft: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: "none", cursor: "pointer" }} aria-label="Notifications">
        <span style={{ position: "relative" }}>
          🔔
          {unread > 0 && <span style={{
            position: "absolute", top: -6, right: -10, background: "#ef4444", color: "white", padding: "2px 6px", borderRadius: 12, fontSize: 12
          }}>{unread}</span>}
        </span>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: 36, width: 340, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", borderRadius: 8, zIndex: 999
        }}>
          <div style={{ padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Notifications</strong>
            <div>
              <button onClick={handleMarkAll} style={{ marginRight: 8 }}>Mark all</button>
              <Link to="/notifications" onClick={() => setOpen(false)}>View all</Link>
            </div>
          </div>

          <div style={{ maxHeight: 280, overflow: "auto" }}>
            {items.length === 0 && <div style={{ padding: 12 }}>No notifications</div>}
            {items.map(n => (
              <div key={n.id} style={{ padding: 10, borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.read ? "normal" : "600" }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {!n.read && <button onClick={() => handleMarkRead(n.id)} style={{ fontSize: 12 }}>Mark</button>}
                  <button onClick={() => handleDelete(n.id)} style={{ fontSize: 12 }}>Del</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 8, borderTop: "1px solid #eee", textAlign: "center" }}>
            <Link to="/notifications" onClick={() => setOpen(false)}>Open notifications page</Link>
          </div>
        </div>
      )}
    </div>
  );
}
