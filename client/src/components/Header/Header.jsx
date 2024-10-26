import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../util/AuthContext";
import './Header.css';

export default function Header() {
  const { isLoggedIn, userData, setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
    navigate("/profile");
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
          <span className="header-back-button" onClick={handleBackClick}>
            ⬅
          </span>
        )}
        <div className="header-title" onClick={() => navigate("/")}>
          PathPal
        </div>
        {isLoggedIn ? (
          <div className="header-menu">
            <span onClick={toggleMenu} style={{ cursor: "pointer" }}>👤</span>
            {menuOpen && (
              <div className="header-menu-items">
                {userData && (
                  <div className="header-greeting">Hi {userData.firstName}</div>
                )}
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
    </div>
  );
}