import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home({ currentUser, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/user/get-all-users");
        const filteredUsers = response.data
          .filter(user => user.userId !== currentUser.id)
          .filter(user => user.userId);
        setContacts(filteredUsers);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.id) {
      fetchUsers();
    }
  }, [currentUser]);

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  const handleProfileClick = (user) => {
    navigate(`/profile/${user.userId}`);
  };

  const handleChatClick = (user) => {
    navigate(`/chat/${user.userId}`);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="header">
        <h1 className="title">Chat App</h1>
        <div className="user-info">
          <span>Hello, {currentUser?.username}</span>
          <button onClick={confirmLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading contacts...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="contacts-list">
          {filteredContacts.map((contact) => (
            <div key={`contact-${contact.userId}`} className="contact-item">
              <div className="contact-info">
                <div 
                  className="contact-name"
                  onClick={() => handleProfileClick(contact)}
                >
                  {contact.username}
                  {contact.isOnline && <span className="online-status">• Online</span>}
                </div>
                <div 
                  className="last-message-preview"
                  onClick={() => handleChatClick(contact)}
                >
                  Click to chat
                </div>
              </div>
              <button 
                className="chat-button"
                onClick={() => handleChatClick(contact)}
              >
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;