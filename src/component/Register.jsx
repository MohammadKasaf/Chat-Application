import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/user/register-user", formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
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

        <button 
          className="register-btn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="register-form-note">
        Already have an account?{" "}
        <button className="register-btn-secondary" onClick={handleLoginClick}>
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;