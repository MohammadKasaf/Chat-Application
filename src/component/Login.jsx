import axios from "axios";
import { useState } from "react";
import "../css/Login.css";

function Login({ onRegisterClick, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put("http://localhost:8080/user/login-user", null, {
        params: {
          username: credentials.username,
          password: credentials.password
        }
      });

      console.log("Login API response:", response.data);
      
      if (!response.data?.userId) {
        throw new Error("Server did not return user ID");
      }

      localStorage.setItem("usernameForLogout", credentials.username);
      onLoginSuccess(response.data);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Login</h1>

      <div className="login-input">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={credentials.username}
          onChange={handleChange}
        />
      </div>

      <div className="login-input">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={credentials.password}
          onChange={handleChange}
        />
      </div>

      <button 
        className="login-btn" 
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      
      <p className="create-account">Don't have an account?</p>
      <button className="register-btn" onClick={onRegisterClick}>
        Register
      </button>
    </div>
  );
}

export default Login;