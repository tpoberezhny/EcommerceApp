import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import "../styles/Register.scss";

const Register = ({ setIsAuthenticated, setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        setIsAuthenticated(true);
        setUsername(response.data.user.username);
        setLocalUsername("");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register">
      <h2>Create an Account</h2>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login" style={{"textDecoration": "underline", "fontSize": "15px"}}>Log In</a>
      </p>
    </div>
  );
};

export default Register;
