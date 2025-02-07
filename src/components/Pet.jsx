import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./Pet.css";

function Pet({ pet, isMyPet = false, onDelete }) {

    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your pet? This action cannot be undone.");

        if (!confirmDelete) return;
        try {
            await PetApi.deletePet(pet.id); // Use the API method with pet id
            alert("Pet deleted successfully.");
            // navigate("/"); 
            onDelete(pet.id);
        } catch (err) {
            console.error("Error deleting pet:", err);
            alert("Failed to delete pet. Please try again.");
        }
    };

    return (

        <div className="Pet">
            <h3><Link to={`/pets/${pet.id}`}>{pet.name}</Link></h3>
            <img src={pet.photoUrl} alt={pet.name} />

            {/* <p>{pet.type}</p>
            <p>Breed: {pet.breed}</p>
            <p>{pet.age} years old</p>
            <p>{pet.bio}</p> */}

            {isMyPet && (
                <div className="Pet-actions">

                    <Link className="petbtneditDelete petbtnEdit" to={`/pets/edit/${pet.id}`}><FontAwesomeIcon icon={faEdit} /></Link>

                    <button className="petbtneditDelete petbtnDelete" onClick={handleDelete} aria-label="Delete"> <FontAwesomeIcon icon={faTrashAlt} /></button>
                </div>
            )}
        </div>


    );
}

export default Pet;