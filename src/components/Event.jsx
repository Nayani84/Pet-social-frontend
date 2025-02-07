import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./Event.css";

function Event({ event, currentUser }) {
  const isOwner = currentUser && currentUser.id === event.createdBy;
const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the event? This action cannot be undone.");

    if (!confirmDelete) return;
    try {
        await PetApi.deleteEvent(event.id); // Use the API method with pet id
        alert("Event deleted successfully.");
        navigate("/"); 
    } catch (err) {
        console.error("Error deleting event:", err);
        setError("Failed to delete event. Please try again.");
    }
};

  return (
    <div className="event">
      <h3>
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h3>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      {isOwner && (
        <div className="Event-actions">
            <Link className="btneditDelete btnEdit" to={`/events/edit/${event.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
          <button className="btneditDelete btnDelete" onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
      )}
    </div>
  );
};

export default Event;
