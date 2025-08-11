import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authServices";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = loginUser(username, password);
    if (user) {
      setUser(user);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin} style={{ background: "#f9fafb", padding: "30px", borderRadius: "8px" }}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "8px 12px", background: "#1f2937", color: "white", border: "none" }}>
          Login
        </button>
      </form>
    </div>
  );
}
