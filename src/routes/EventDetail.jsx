import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import "./EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const fetchedEvent = await PetApi.getEvent(id);
        setEvent(fetchedEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    }
    fetchEvent();
  }, [id]);

  const handleGoogleCalendar = () => {
    // Redirect to the backend route which handles Google OAuth
    window.location.href = `http://localhost:3001/auth/login?eveid=${id}`;
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Start Time:</strong> {event.startTime}</p>
      <p><strong>End Time:</strong> {event.endTime}</p>
      <p><strong>Created By:</strong> User {event.createdBy}</p>

      {currentUser &&(
        <button onClick={handleGoogleCalendar} className="btngoogle-calendar">Add to Google Calendar</button>
      )}
      {/* <button onClick={handleGoogleCalendar}>Add to Google Calendar</button> */}
    </div>
  );
};

export default EventDetail;
