import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import './PetDetail.css';


function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(CurrentUserContext);

  // Fetch the pet details on mount
  useEffect(() => {
    async function fetchPet() {
      try {
        setLoading(true);
        const fetchedPet = await PetApi.getPet(id);
        setPet(fetchedPet);
      } catch (err) {
        console.error("Error fetching pet data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!pet) return <p>Pet not found!</p>;

  return (
    <div className="PetDetail">
      <h1>{pet.name}</h1>
      <img src={pet.photoUrl} alt={pet.name} />
      <p><strong>Type: </strong>{pet.type}</p>
      <p><strong>Breed: </strong>{pet.breed}</p>
      <p><strong>Age: </strong>{pet.age}</p>
      <p><strong>Bio: </strong>{pet.bio}</p>
    </div>
  );
}


export default PetDetail;
