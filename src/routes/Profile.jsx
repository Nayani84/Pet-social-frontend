import React, { useState, useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import MyPetList from "./MyPetList";
import MyPostList from "./MyPostList";
import { Link, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import "./Profile.css";

function Profile({ loading }) {
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const onDelete = async (username) => {
        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

        if (!confirmDelete) return;
        try {
            await PetApi.deleteUser(username); // Use the API method with username
            alert("Profile deleted successfully.");
            navigate("/"); // Redirect after successful deletion
        } catch (err) {
            console.error("Error deleting profile:", err);
            setError("Failed to delete profile. Please try again.");
        }
    };


    return (
        <div className="profile-container">
            <div className="profile-header">
                {currentUser.profilePic && (
                    <img
                        src={currentUser.profilePic}
                        alt={`${currentUser.username}'s profile`}
                        className="profile-pic"
                    />
                )}

                {/* Profile info and actions */}
                <div className="profile-info-actions">
                    <h2>{currentUser.username} Profile</h2>

                    <div className="profile-actions">
                        <Link className="profile-action-button edit-button" to={`/users/edit/${currentUser.username}`}>
                            <FontAwesomeIcon icon={faUserPen} /> Edit Profile
                        </Link>
                        <button className="profile-action-button delete-button" onClick={() => onDelete(currentUser.username)}>
                            <FontAwesomeIcon icon={faUserSlash} /> Delete Profile
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="profile-content-layout">
                <div className="profile-pets-section">
                    <MyPetList />
                </div>
                <div className="profile-posts-section">
                    <MyPostList />
                </div>
            </div>
        </div>
    );
}

export default Profile;
