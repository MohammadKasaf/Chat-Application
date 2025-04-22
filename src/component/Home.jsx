import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/Home.css";

function Home({ currentUser, onLogout, onProfileClick, onChatClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/user/get-all-users");
        console.log("All users response:", response.data);
        
        const filteredUsers = response.data
          .filter(user => user.userId !== currentUser.id)
          .map(user => {
            if (!user.userId) {
              console.error("User missing userId:", user);
            }
            return user;
          })
          .filter(user => user.userId); // Filter out users without IDs
        
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
    } else {
      console.error("Current user ID missing - cannot fetch contacts");
      setError("Cannot load contacts - user not properly logged in");
      setLoading(false);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      const username = localStorage.getItem("usernameForLogout");
      await axios.put("http://localhost:8080/user/logout-user", null, {
        params: { username },
      });
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed: " + (err.response?.data?.message || err.message));
    }
  };

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
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
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div key={`contact-${contact.userId}`} className="contact-item">
                <div className="contact-info">
                  <div 
                    className="contact-name"
                    onClick={() => onProfileClick(contact)}
                  >
                    {contact.username}
                    {contact.isOnline && <span className="online-status">• Online</span>}
                  </div>
                  <div 
                    className="last-message-preview"
                    onClick={() => onChatClick(contact)}
                  >
                    Click to chat
                  </div>
                </div>
                <button 
                  className="chat-button"
                  onClick={() => onChatClick(contact)}
                >
                  Message
                </button>
              </div>
            ))
          ) : (
            <div className="no-contacts">No contacts found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;