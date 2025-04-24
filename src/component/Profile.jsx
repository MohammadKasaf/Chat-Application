import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../css/Profile.css';

function Profile({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/get-user-byId?userId=${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return <div className="profile-container">Loading user data...</div>;
  }

  if (!userData) {
    return <div className="profile-container">User not found</div>;
  }

  return (
    <div className="profile-container">
      <button className="back-button" onClick={handleBack}>⬅ Back</button>

      <div className="profile-header">
        <h2 className="profile-username">{userData.username}</h2>
      </div>

      <div className="profile-details">
        <div className="profile-info">
          <label className="profile-label">User ID:</label>
          <p className="profile-data">{userData.userId}</p>
        </div>

        <div className="profile-info">
          <label className="profile-label">Email:</label>
          <p className="profile-data">{userData.email || "N/A"}</p>
        </div>

        <div className="profile-info">
          <label className="profile-label">Date of Birth:</label>
          <p className="profile-data">{userData.dob || "N/A"}</p>
        </div>

        <div className="profile-info">
          <label className="profile-label">Online Status:</label>
          <p className="profile-data">{userData.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;