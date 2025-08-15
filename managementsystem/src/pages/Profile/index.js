// src/pages/Profile/index.js
import React, { useEffect, useState } from "react";
import "./Profile.css";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  registerUser,
  resetAllPasswords 
} from "../../services/authServices";

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({ username: "", role: "", email: "", phone: "", avatar: "" });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "Guest", phone: "" });

  useEffect(() => {
    if (!user) return;

    async function loadUserData() {
      try {
        const profileData = await getProfile();
        setForm({
          username: profileData.username || "",
          role: profileData.role || "Guest",
          email: profileData.email || "",
          phone: profileData.phone || "",
          avatar: profileData.avatar || ""
        });

        if (profileData.role === "Admin") {
          const allUsers = await getAllUsers();
          const mappedUsers = allUsers.map(u => ({
            id: u.id || u._id,
            username: u.username,
            email: u.email,
            role: u.role,
            phone: u.phone
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    if (!form.username) return alert("Username required");
    try {
      await updateProfile(user.id, form);
      setUser({ ...user, ...form });
      alert("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  }

  // Admin: delete a user
  async function handleDeleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(u => u.filter(user => user.id !== id));
      alert("User deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  // Admin: reset user password
  async function handleResetPassword(id) {
    try {
      await resetAllPasswords(); // or implement single-user reset if available
      alert("Passwords reset successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  }

  // Admin: add user inline
  async function handleAddUser() {
    if (!newUser.username || !newUser.password) return alert("Username and password are required");
    try {
      const added = await registerUser(newUser);
      const mapped = {
        id: added.id || added._id,
        username: added.username,
        email: added.email,
        role: added.role,
        phone: added.phone
      };
      setUsers(u => [...u, mapped]);
      setNewUser({ username: "", email: "", password: "", role: "Guest", phone: "" });
      alert("User added successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  }

  if (!user) return <p>Please login to view your profile.</p>;
  if (loading) return <p className="muted">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1>Profile ({user.role})</h1>
      <div className="profile-card">
        <div className="avatar-section">
          {form.avatar ? (
            <img src={form.avatar} alt="avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">No avatar</div>
          )}
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="avatar-upload" />
        </div>

        <div className="profile-form">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} />

          <label>Role (read-only)</label>
          <input name="role" value={form.role} readOnly />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />

          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <div className="profile-buttons">
            <button onClick={saveProfile} className="edit-btn">Save profile</button>
          </div>
        </div>
      </div>

      {/* Admin: User management */}
      {user.role === "Admin" && (
        <div className="admin-user-list" style={{ marginTop: 30 }}>
          <h2>All Users</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.phone}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(u.id)} className="edit-btn">Delete</button>
                    <button onClick={() => handleResetPassword(u.id)} className="edit-btn" style={{ marginLeft: 5 }}>Reset Password</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center" }}>No users found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Inline Add User Form */}
          <div style={{ marginTop: 20 }}>
            <h3>Add New User</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input placeholder="Username" value={newUser.username} onChange={e => setNewUser(n => ({ ...n, username: e.target.value }))} />
              <input placeholder="Email" value={newUser.email} onChange={e => setNewUser(n => ({ ...n, email: e.target.value }))} />
              <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser(n => ({ ...n, password: e.target.value }))} />
              <input placeholder="Phone" value={newUser.phone} onChange={e => setNewUser(n => ({ ...n, phone: e.target.value }))} />
              <select value={newUser.role} onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}>
                <option value="Guest">Guest</option>
                <option value="Admin">Admin</option>
              </select>
              <button onClick={handleAddUser} className="edit-btn">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
