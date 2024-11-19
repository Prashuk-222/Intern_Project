import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setName(docSnap.data().name);
        }
      }
    };
    fetchUser();
  }, []);

  // Update user profile and redirect to notes page on successful update
  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), { name });
        alert("Profile updated successfully");
        navigate("/notes"); // Redirect to Notes page after update
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile</h1>
        {user && (
          <>
            <p className="profile-email">Email: {user.email}</p>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="profile-input"
            />
            <div className="button-group">
              <button onClick={handleUpdate} className="update-button">
                Update Profile
              </button>
              <button
                onClick={() => navigate("/notes")}
                className="back-button"
              >
                Back to Notes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
