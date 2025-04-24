import React, { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./component/Chat";
import Home from "./component/Home";
import Login from "./component/Login";
import Profile from "./component/Profile";
import Register from "./component/Register";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    
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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isLoggedIn ? (
                <Register />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />
          <Route 
            path="/home" 
            element={
              isLoggedIn ? (
                <Home 
                  currentUser={currentUser} 
                  onLogout={handleLogout} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              isLoggedIn ? (
                <Profile currentUser={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/chat/:userId" 
            element={
              isLoggedIn ? (
                <Chat currentUser={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={isLoggedIn ? "/home" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;