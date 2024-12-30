import { useState, useContext } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LocationPage.module.css";
import { preprocessRestaurantData } from "../models/Restaurant";
import { BracketContext } from "../context/BracketContext";

function LocationPage() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const { setRestaurants } = useContext(RestaurantContext);
  const { resetTournament } = useContext(BracketContext);

  const navigate = useNavigate();

  const handleLocationClick = () => {
    // Reset localStorage and state
    resetTournament();
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
      setLoading(false);
    }
  };

  function success(position) {
    console.log("Got location");
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setLocation({ latitude, longitude });
    fetchRestaurants(latitude, longitude);
  }

  function error() {
    console.log("Unable to retrieve your location");
    setLoading(false);
  }

  const fetchRestaurants = async (latitude, longitude) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/places:searchNearby`,
        {
          latitude,
          longitude,
          radius: 4000,
          includedTypes: ["restaurant"],
        }
      );
      console.log("Response:", response.data.places);
      const processedData = preprocessRestaurantData(
        response.data.places.slice(0, 16)
      );
      setRestaurants(processedData);
      navigate("/Bracket");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        {!loading ? (
          <div className={styles.container}>
            <div className={styles.emojiSection}>🍔 🥊</div>
            <h1>Bite Battle!</h1>
            <button onClick={handleLocationClick}>Get current location</button>
            <div></div>
          </div>
        ) : (
          <div>
            <h2 style={{ color: "white" }}>Generating your bracket</h2>
            <progress />
          </div>
        )}
      </div>
      <video className={styles.video} autoPlay loop muted playsInline>
        <source src="burgerbrawl.mp4" type="video/mp4" />
      </video>
    </>
  );
}

export default LocationPage;
