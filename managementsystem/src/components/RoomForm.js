import React, { useEffect, useState } from "react";

export default function RoomForm({ onSave, editingRoom, onCancel, isAdmin }) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    capacity: "",
    location: "",
    features: "",
    isActive: true,
    isAvailable: true
  });

  useEffect(() => {
    if (editingRoom) {
      setForm({
        id: editingRoom.id,
        name: editingRoom.name || "",
        capacity: editingRoom.capacity ?? "",
        location: editingRoom.location || "",
        features: editingRoom.features || "",
        isActive: editingRoom.isActive ?? true,
        isAvailable: editingRoom.isAvailable ?? true
      });
    } else {
      setForm({
        id: null,
        name: "",
        capacity: "",
        location: "",
        features: "",
        isActive: true,
        isAvailable: true
      });
    }
  }, [editingRoom]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Only admins can perform this action.");
      return;
    }
    if (!form.name || !form.capacity || !form.location) {
      alert("Please fill in name, capacity and location.");
      return;
    }
    onSave({
      ...form,
      capacity: Number(form.capacity)
    });
  };

  return (
    <form className="room-form" onSubmit={handleSubmit}>
      <h3>{form.id ? "Edit Room" : "Add Room"}</h3>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Room name (e.g. Meeting Room 1)"
      />

      <input
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        placeholder="Capacity (number)"
        type="number"
        min="1"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location (e.g. Floor 2)"
      />

      <input
        name="features"
        value={form.features}
        onChange={handleChange}
        placeholder="Features (comma separated, e.g. Projector, VC)"
      />

      <label className="inline">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        <span> Active</span>
      </label>

      <label className="inline" style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          name="isAvailable"
          checked={form.isAvailable}
          onChange={handleChange}
        />
        <span> Available</span>
      </label>

      <div style={{ marginTop: 10 }}>
        <button type="submit" className="btn-primary">
          {form.id ? "Update Room" : "Create Room"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost"
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
