import React, { useState } from "react";

export default function Rooms({ user }) {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room A", capacity: 10, location: "Floor 1", features: "Projector" },
    { id: 2, name: "Room B", capacity: 20, location: "Floor 2", features: "Video Conferencing" }
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    capacity: "",
    location: "",
    features: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Edit room
      setRooms(rooms.map((room) => (room.id === formData.id ? formData : room)));
    } else {
      // Add new room
      setRooms([...rooms, { ...formData, id: Date.now() }]);
    }
    setFormData({ id: null, name: "", capacity: "", location: "", features: "" });
  };

  const handleEdit = (room) => {
    setFormData(room);
  };

  const handleDelete = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <div>
      <h1>Rooms</h1>

      {user?.role === "Admin" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="features"
            placeholder="Features"
            value={formData.features}
            onChange={handleChange}
          />
          <button type="submit">
            {formData.id ? "Update Room" : "Add Room"}
          </button>
        </form>
      )}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Features</th>
            {user?.role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.capacity}</td>
              <td>{room.location}</td>
              <td>{room.features}</td>
              {user?.role === "Admin" && (
                <td>
                  <button onClick={() => handleEdit(room)}>Edit</button>
                  <button onClick={() => handleDelete(room.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
