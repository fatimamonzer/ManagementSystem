// src/pages/Notifications/index.js
import React, { useEffect, useState } from "react";
import { getNotificationsForUser, markRead, deleteNotification, markAllReadForUser } from "../../services/notificationService";

export default function NotificationsPage({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    refresh();
  }, [user]);

  function refresh() {
    setItems(getNotificationsForUser(user?.username));
  }

  const handleMarkRead = (id) => { markRead(id); refresh(); };
  const handleDelete = (id) => { if (!window.confirm("Delete notification?")) return; deleteNotification(id); refresh(); };
  const handleMarkAll = () => { markAllReadForUser(user.username); refresh(); };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Notifications</h1>
        <div>
          <button onClick={handleMarkAll}>Mark all read</button>
        </div>
      </div>

      {items.length === 0 && <p>No notifications</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.map(n => (
          <li key={n.id} style={{ padding: 12, border: "1px solid #eef2f7", marginBottom: 8, borderRadius: 6, background: n.read ? "#fff" : "#f8fafc" }}>
            <div style={{ display:"flex", justifyContent: "space-between" }}>
              <div>
                <strong>{n.title}</strong>
                <div style={{ color: "#6b7280" }}>{n.body}</div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:6 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                {!n.read && <button onClick={() => handleMarkRead(n.id)}>Mark read</button>}
                <button onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
