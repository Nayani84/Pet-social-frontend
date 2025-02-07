import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

function SignupForm({ signup }) {
  const navigate = useNavigate();
  const INITIAL_STATE = {
    username: '',
    password: '',
    name: '',
    email: '',
    profilePic: '',
    isAdmin: false
  }

  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        profilePic: formData.profilePic.trim() ? formData.profilePic : 'http://localhost:3001/images/user.png',
      };
      await signup(data);
      navigate("/");
    } catch (err) {
      console.error("Error creating profile:", err);
      alert("Failed to signup. Please try again.");
    }
  };


  return (
    <div className="Signup-container">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="username">
            Username :
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password :
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">
            Name :
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            E-mail :
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePic">
            Profile Picture Url :
          </label>
          <input
            id="profilePic"
            name="profilePic"
            type="text"
            placeholder="Profile Picture Url"
            value={formData.profilePic}
            onChange={handleChange}
          />
        </div>

        <input type="hidden" name="isAdmin" value={formData.isAdmin} />

        <button className="submit-button" type="submit">Sign up</button>
      </form>
    </div>

  );
}

export default SignupForm;
