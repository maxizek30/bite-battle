import { useState, useContext } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LocationPage.module.css";
import { preprocessRestaurantData } from "../models/Restaurant";

function LocationPage() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const { setRestaurants } = useContext(RestaurantContext);

  const navigate = useNavigate();

  const handleLocationClick = () => {
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
      className={styles.container}
    >
      {!loading ? (
        <>
          <div className={styles.emojiSection}>🍔 🥊</div>
          <h1>Bite Battle!</h1>
          <button onClick={handleLocationClick}>Get current location</button>
          <div></div>
        </>
      ) : (
        <div>
          <h2 style={{ color: "white" }}>Generating your bracket</h2>
          <progress />
        </div>
      )}
    </div>
  );
}

export default LocationPage;
