import React, { useEffect, useMemo, useState } from "react";
import RoomForm from "../../components/RoomForm";
import RoomList from "../../components/RoomList";
import "./rooms.css";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomServices";

export default function Rooms({ user }) {
  const isAdmin = useMemo(() => user?.role?.toLowerCase() === "admin", [user]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (e) {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (room) => {
    try {
      if (!isAdmin) return alert("Only admins can perform this action.");

      const payload = {
        name: room.name,
        capacity: Number(room.capacity),
        location: room.location,
        features: room.features || "",
        isActive: room.isActive ?? true,
        isAvailable: room.isAvailable ?? true
      };

      if (room.id) {
        await updateRoom(room.id, payload);
      } else {
        await createRoom(payload);
      }

      await load();
      setEditingRoom(null);
    } catch (e) {
      alert("Save failed. Please try again.");
    }
  };

  const handleEdit = (room) => setEditingRoom(room);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Only admins can delete rooms.");
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      if (editingRoom?.id === id) setEditingRoom(null);
    } catch (e) {
      alert("Delete failed. Please try again.");
    }
  };

  const cancelEdit = () => setEditingRoom(null);

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Rooms</h1>
        <p className="muted">
          Manage meeting rooms (Admins can create, edit, and delete).
        </p>
      </div>

      {isAdmin && (
        <div className="rooms-form-wrap">
          <RoomForm
            onSave={handleSave}
            editingRoom={editingRoom}
            onCancel={cancelEdit}
            isAdmin={isAdmin}
          />
        </div>
      )}

      <div className="rooms-list-wrap">
        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <RoomList
            rooms={rooms}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}
