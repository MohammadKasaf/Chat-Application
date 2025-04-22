import axios from 'axios';
import React, { useEffect, useState } from "react";
import './Profile.css';

function Profile({ user, onBack }) {
  const [userData, setUserData] = useState(null);

  // Fetch data from the API when component mounts
  useEffect(() => {
    if (user?.username) {
      axios.get(`http://localhost:8080/user/get-user-byUsername?username=${user.username}`)
        .then(response => {
          console.log("User data fetched successfully:", response.data);  // Logs successful data
          setUserData(response.data);  // Set the fetched user data to state
        })
        .catch(error => {
          console.error("Error fetching user data:", error);  // Logs error if API fails
        });
    }
  }, [user]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      <button className="back-button" onClick={onBack}>⬅ Back</button>

      <div className="profile-header">
        <h2 className="profile-username">{userData.username || "Unknown User"}</h2>
      </div>

      <div className="profile-details">
        <div className="profile-info">
          <label className="profile-label">User ID:</label>
          <p className="profile-data">{userData.userId || "N/A"}</p>
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
