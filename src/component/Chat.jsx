import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Chat.css';

function Chat({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/get-user-byId?userId=${userId}`);
        setSelectedUser(response.data);
        setIsOnline(response.data.isOnline || false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/message/chat-between-users", {
          params: {
            userId1: currentUser.id,
            userId2: userId
          }
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && currentUser?.id) {
      fetchUserData();
      fetchMessages();
    }
  }, [userId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const tempId = Date.now();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        ...messageData,
        senderName: currentUser.username,
        receiverName: selectedUser?.username,
        status: isOnline ? 'DELIVERED' : 'SENT'
      }
    ]);

    setNewMessage("");

    try {
      await axios.post("http://localhost:8080/message/send-message", messageData);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back
        </button>
        <div className="chat-user-info">
          <h3>{selectedUser?.username || "Loading..."}</h3>
          <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-messages">Loading messages...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id || msg.timestamp}
              className={`message-bubble ${msg.senderName === currentUser.username ? 'sent' : 'received'}`}
            >
              <div className="message-content">{msg.content}</div>
              <div className="message-meta">
                <small>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
                {msg.senderName === currentUser.username && (
                  <span className={`status-indicator ${msg.status?.toLowerCase() || 'sent'}`}>
                    {msg.status === 'DELIVERED' || msg.status === 'READ' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="message-input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;