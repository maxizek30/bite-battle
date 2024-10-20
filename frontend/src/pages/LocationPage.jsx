import { useState, useContext } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LocationPage.module.css";
import exampleData from "../../data/exampleData";

function LocationPage() {
  // const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const { setRestaurants } = useContext(RestaurantContext);

  const navigate = useNavigate();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  };
  function success(position) {
    console.log("Got location");
    setLoading(true);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setLocation({ latitude, longitude });
    fetchRestaurants(latitude, longitude);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  const fetchRestaurants = async (latitude, longitude) => {
    setLoading(true);
    try {
      // Commented out for demo purposes
      //
      // const response = await axios.get(
      //   `http://localhost:8000/api/restaurants?latitude=${latitude}&longitude=${longitude}`
      // );
      //setRestaurants(response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRestaurants(exampleData);

      navigate("/Bracket");
    } catch (error) {
      console.error("Error fetching Yelp data:", error);
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
