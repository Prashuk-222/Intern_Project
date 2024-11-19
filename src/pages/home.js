// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./home.css"
const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to the User Management App</h1>
      <p>Manage your profile and personal notes securely.</p>
      <div>
        <Link to="/register" className="link">Register</Link> | 
        <Link to="/login" className="link"> Login</Link>
      </div>
    </div>
  );
};

export default Home;
