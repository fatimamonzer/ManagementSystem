// src/components/NotificationToast.js
import React from "react";
export default function NotificationToast({ message }) {
  return (
    <div style={{
      position:"fixed", right:20, top:20, background:"#111827", color:"#fff",
      padding:"8px 12px", borderRadius:6, zIndex:9999, boxShadow:"0 2px 8px rgba(0,0,0,0.2)"
    }}>
      {message}
    </div>
  );
}
