import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";
import styles from "../styles/ShowdownScreen.module.css";

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

  return (
    <div className={styles.container}>
      <div className={styles.seperator} />
      <button
        className={styles.locationContainer}
        onClick={() => handleSelect(match.teams[0])}
      >
        <div className={styles.topSection}>
          <h1>{match.teams[0].name}</h1>
          <div className={styles.restaurantAttributes}>
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
        <img src={match.teams[0].image_url} className={styles.image} />
      </button>
      <div className={styles.seperator} />
      <button
        onClick={() => handleSelect(match.teams[1])}
        className={styles.locationContainer}
      >
        <div className={styles.topSection}>
          <h1>{match.teams[1].name}</h1>
          <div className={styles.restaurantAttributes}>
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
        <img src={match.teams[1].image_url} className={styles.image} />
      </button>
      <div className={styles.seperator} />
    </div>
  );
}

export default ShowdownScreen;
