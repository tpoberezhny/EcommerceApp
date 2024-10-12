import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Login.scss";

const Login = ({ setIsAuthenticated, setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { username, password });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        setIsAuthenticated(true);
        setUsername(response.data.user.username);
        navigate("/");
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
      <button
        className="google-login"
        onClick={() =>
          (window.location.href = `${process.env.BASE_URL}/auth/google`)
        }
      >
        Log in with Google
      </button>
    </div>
  );
};

export default Login;
