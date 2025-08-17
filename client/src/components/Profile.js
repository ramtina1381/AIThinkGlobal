import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Profile.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, formData);
    alert("Profile updated successfully!");
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header"></div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <button className="sidebar-btn active">Edit Profile</button>
          <button className="sidebar-btn">Applications</button>
          <button className="sidebar-btn">Password</button>
          <button className="sidebar-btn">Help</button>
          <button className="sidebar-btn" onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>

        {/* Form Section */}
        <div className="profile-form-section">
          <h1>Edit Profile</h1>
          <div className="profile-form-grid">
          <div className="form-group">
            <label htmlFor="firstName"><strong>First Name</strong></label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName"><strong>Last Name</strong></label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="disabled"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address"><strong>Address</strong></label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city"><strong>City</strong></label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state"><strong>State</strong></label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="contactNumber"><strong>Contact Number</strong></label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
            />
          </div>
        </div>

          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
