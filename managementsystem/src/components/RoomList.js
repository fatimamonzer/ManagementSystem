import React from "react";

export default function RoomList({ rooms, onEdit, onDelete, isAdmin }) {
  if (!rooms.length) return <p>No rooms available yet.</p>;

  return (
    <div className="room-list">
      <table className="room-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Features</th>
            <th>Active</th>
            <th>Available</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.capacity}</td>
              <td>{r.location}</td>
              <td>{r.features}</td>
              <td>{r.isActive ? "Yes" : "No"}</td>
              <td>{r.isAvailable ? "Yes" : "No"}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => onEdit(r)} className="btn-sm">Edit</button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="btn-sm danger"
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
