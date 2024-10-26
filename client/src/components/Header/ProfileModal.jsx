import React from "react";
import './ProfileModal.css';

export default function ProfileModal({ userData, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Profile</h2>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}