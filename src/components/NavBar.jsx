
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";
import PetApi from "../PetApi";
import { io } from "socket.io-client";

function NavBar({ onLogout }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  const socket = io(socketUrl);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      socket.on("notification", (newNotification) => {
        setNotifications(prev => [...prev, newNotification]);
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => socket.disconnect(); // Cleanup the socket connection
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await PetApi.getNotifications(currentUser.id);
      setNotifications(res.notifications);
      setUnreadCount(res.notifications.filter(notif => !notif.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Call the backend API to mark the notification as read
      await PetApi.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif => {
        if (notif.id === notificationId) {
          return { ...notif, is_read: true };
        }
        return notif;
      }));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const logout = () => {
    onLogout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">PetLovers</Link>
      </div>
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <Link to="/profile">{currentUser?.username || "Profile"}</Link>
        <Link to="/pets">Pets</Link>
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <>
            <Link to="/profile">{currentUser.username}</Link>
            <Link to="/pets">Pets</Link>
            <div onClick={toggleNotifications} className="notification-bell">
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* <div className="navbar-right"> */}

      {showNotifications && (
        <div className="notifications-popup">
          {notifications.map(notif => (
            <div key={notif.id} className="notification-item">
              {notif.content}
              {!notif.is_read && (
                <button onClick={() => markNotificationAsRead(notif.id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
