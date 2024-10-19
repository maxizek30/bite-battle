import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";

function ShowdownScreen() {
  const { onSelectWinner } = useContext(BracketContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { match } = location.state;

  useEffect(() => {
    console.log("Match:", match);
  }, [match]);

  const handleSelect = (winner) => {
    onSelectWinner(match.id, winner);
    navigate("/bracket");
  };

  const styles = {
    container: {
      backgroundColor: "grey",
      display: "flex",
      flexDirection: "row",
      height: "100vh",
      alignItems: "center",
    },
    locationContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "black",
      justifyContent: "space-around",
      flex: 1,
      borderRadius: "10px",
      height: "96%",
    },
    restaurantAttributes: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },
    image: {
      maxHeight: "50%",
    },
    seperator: {
      width: "2%",
    },
    topSection: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.seperator} />
      <button
        style={styles.locationContainer}
        onClick={() => handleSelect(match.teams[0])}
      >
        <div style={styles.topSection}>
          <h1>{match.teams[0].name}</h1>
          <div style={styles.restaurantAttributes}>
            <h4>⭐️ {match.teams[0].rating}</h4>
            <h4>💵 {match.teams[0].price}</h4>
            <h4>🏎 {(match.teams[0].distance / 1609.34).toFixed(2)} miles</h4>
          </div>
          <h5>
            Categories:{" "}
            {match.teams[0].categories
              .map((category) => category.title)
              .join(", ")}
          </h5>
        </div>
        <img src={match.teams[0].image_url} style={styles.image} />
      </button>
      <div style={styles.seperator} />
      <button
        onClick={() => handleSelect(match.teams[1])}
        style={styles.locationContainer}
      >
        <div style={styles.topSection}>
          <h1>{match.teams[1].name}</h1>
          <div style={styles.restaurantAttributes}>
            <h4>⭐️ {match.teams[1].rating}</h4>
            <h4>💵 {match.teams[1].price}</h4>
            <h4>🏎 {(match.teams[1].distance / 1609.34).toFixed(2)} miles</h4>
          </div>
          <h5>
            Categories:{" "}
            {match.teams[1].categories
              .map((category) => category.title)
              .join(", ")}
          </h5>
        </div>
        <img src={match.teams[1].image_url} style={styles.image} />
      </button>
      <div style={styles.seperator} />
    </div>
  );
}

export default ShowdownScreen;
