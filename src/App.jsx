import React, { useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState("Home");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    console.log("Login response data:", userData);
    if (!userData?.userId) {
      console.error("No userId in login response!");
      alert("Login error: No user ID received");
      return;
    }

    setIsLoggedIn(true);
    setCurrentUser({
      id: userData.userId,
      username: userData.username,
      email: userData.email,
      isOnline: userData.isOnline
    });
    localStorage.setItem("usernameForLogout", userData.username);
    localStorage.setItem("userId", userData.userId);
    setView("Home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedUser(null);
    localStorage.clear();
    setView("Home");
  };

  const handleRegisterClick = () => setShowRegister(true);
  const handleLoginClick = () => setShowRegister(false);

  const handleProfileClick = (user) => {
    if (!user?.userId) {
      console.error("Profile click - missing userId:", user);
      return;
    }
    setSelectedUser({
      id: user.userId,
      username: user.username,
      email: user.email,
      isOnline: user.isOnline
    });
    setView("Profile");
  };

  const handleChatClick = (user) => {
    console.log("Chat click user:", user);
    if (!user?.userId) {
      console.error("Chat click - missing userId:", user);
      alert("Cannot start chat - user data incomplete");
      return;
    }
    setSelectedUser({
      id: user.userId,
      username: user.username,
      isOnline: user.isOnline
    });
    setView("Chat");
  };

  const handleBackToHome = () => {
    setView("Home");
    setSelectedUser(null);
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        showRegister ? (
          <Register onLoginClick={handleLoginClick} />
        ) : (
          <Login 
            onRegisterClick={handleRegisterClick} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )
      ) : view === "Home" ? (
        <Home
          currentUser={currentUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onChatClick={handleChatClick}
        />
      ) : view === "Profile" ? (
        <Profile 
          user={selectedUser} 
          onBack={handleBackToHome} 
        />
      ) : view === "Chat" ? (
        <Chat 
          user={currentUser} 
          selectedUser={selectedUser} 
          onBack={handleBackToHome} 
        />
      ) : null}
    </div>
  );
}

export default App;