import React from "react";
import './ProfileModal.css';

export default function ProfileModal({ userData, onClose }) {
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-content">
        <h2 className="profile-modal-title">User Profile</h2>
        <div className="profile-modal-info">
          <p><strong>First Name:</strong> {userData.firstName}</p>
          <p><strong>Last Name:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
        <button className="profile-modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}