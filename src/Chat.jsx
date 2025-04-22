import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';

function Chat({ user, selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(selectedUser?.isOnline || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch chat messages between users
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/message/chat-between-users", {
          params: {
            userId1: user.id,
            userId2: selectedUser.id
          }
        });
        setMessages(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && selectedUser?.id) {
      fetchMessages();
    }
  }, [user, selectedUser]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check the online status of the selected user
  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/check-online', {
          params: { userId: selectedUser.id }
        });
        setIsOnline(response.data);
      } catch (err) {
        console.error("Error checking online status:", err);
      }
    };

    if (selectedUser?.id) {
      checkOnlineStatus();
    }
  }, [selectedUser]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const tempId = Date.now();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        ...messageData,
        senderName: user.username,
        receiverName: selectedUser.username,
        status: isOnline ? 'DELIVERED' : 'SENT'
      }
    ]);

    setNewMessage("");

    try {
      const response = await axios.post("http://localhost:8080/message/send-message", messageData);
      console.log("Server response:", response.data);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  // Handle 'Enter' key press for sending a message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get the status of a message (DELIVERED/SENT)
  const getMessageStatus = (msg) => {
    if (msg.senderName === user.username) {
      return isOnline ? 'DELIVERED' : 'SENT';
    }
    return null;
  };

  // Render the message status indicator
  const renderMessageStatus = (msg) => {
    const status = msg.status || getMessageStatus(msg);
    if (msg.senderName === user.username && status) {
      return (
        <span className={`status-indicator ${status.toLowerCase()}`}>
          {status === 'DELIVERED' || status === 'READ' ? '✓✓' : '✓'}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={onBack} className="back-button">
          &larr; Back
        </button>
        <div className="chat-user-info">
          <h3>{selectedUser.username}</h3>
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
          {messages.length === 0 ? (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id || msg.timestamp}
                className={`message-bubble ${msg.senderName === user.username ? 'sent' : 'received'}`}
              >
                <div className="message-content">{msg.content}</div>
                <div className="message-meta">
                  <small>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                  {renderMessageStatus(msg)}
                </div>
              </div>
            ))
          )}
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