import axios from "axios";
import { useState } from "react";
import '../css/Register.css';


const Register = ({ onLoginClick }) => {
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/user/register-user", formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      alert("User registered successfully!");
      onLoginClick();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-input">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-input">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-input">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-input">
          <input
            type="text"
            name="dob"
            placeholder="Date of Birth (dd-mm-yyyy)"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <button className="register-btn" type="submit">Register</button>
      </form>

      <p className="register-form-note">
        Already have an account?{" "}
        <button className="register-btn-secondary" onClick={onLoginClick}>
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;