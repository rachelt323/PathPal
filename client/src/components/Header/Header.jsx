import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../util/AuthContext";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import './Header.css';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { isLoggedIn, userData, setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleProfile = () => {
    setProfileModalOpen(true);
    handleCloseMenu();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setLoggedIn(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    } finally {
      handleCloseMenu();
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="header-appbar">
      <div className="header-toolbar">
        {location.pathname !== "/" && (
          <FaArrowLeft className="header-back-button" onClick={handleBackClick} />
        )}
        <div className="header-title" onClick={() => navigate("/")}>
          PathPal
        </div>
        {isLoggedIn ? (
          <div className="header-menu">
            <FaUserCircle className={`header-profile-icon ${isLoggedIn ? "header-profile-icon-large" : ""}`} onClick={toggleMenu} />
            {menuOpen && (
              <div className="header-menu-items">
                <button onClick={handleProfile}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="header-button" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>

      {isProfileModalOpen && (
        <ProfileModal 
          userData={userData} 
          onClose={() => setProfileModalOpen(false)} 
        />
      )}
    </div>
  );
}