import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";
import styles from "../styles/ShowdownScreen.module.css";

function ShowdownScreen() {
  const { onSelectWinner } = useContext(BracketContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { match } = location.state;

  const [teamPhotos, setTeamPhotos] = useState({
    team1: [],
    team2: [],
  });
  const [currentIndex, setCurrentIndex] = useState({
    team1: 0,
    team2: 0,
  });

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchTeamPhotos = async (team) => {
          const photoReferences = team.photos?.map((photo) => photo.name) || [];
          const photoUrls = await Promise.all(
            photoReferences.map(async (photoReference) => {
              const response = await fetch(
                `http://localhost:8000/v1/places/photos?photoReference=${photoReference}&maxWidth=400`
              );
              const data = await response.json();
              return data.photoUri;
            })
          );
          return photoUrls;
        };

        const [team1Photos, team2Photos] = await Promise.all([
          fetchTeamPhotos(match.teams[0]),
          fetchTeamPhotos(match.teams[1]),
        ]);

        setTeamPhotos({
          team1: team1Photos,
          team2: team2Photos,
        });
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [match]);

  const handleSelect = (winner) => {
    onSelectWinner(match.id, winner);
    navigate("/bracket");
  };

  const handleNextPhoto = (teamKey) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [teamKey]: (prev[teamKey] + 1) % teamPhotos[teamKey].length,
    }));
  };

  const handlePreviousPhoto = (teamKey) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [teamKey]:
        (prev[teamKey] - 1 + teamPhotos[teamKey].length) %
        teamPhotos[teamKey].length,
    }));
  };

  const renderCarousel = (teamKey, team) => {
    return (
      <div className={styles.carouselContainer}>
        {teamPhotos[teamKey].length > 0 ? (
          <>
            <button
              onClick={() => handlePreviousPhoto(teamKey)}
              className={styles.carouselButton}
            >
              ◀
            </button>
            <img
              src={teamPhotos[teamKey][currentIndex[teamKey]]}
              alt={`${team.name} photo`}
              className={styles.carouselImage}
            />
            <button
              onClick={() => handleNextPhoto(teamKey)}
              className={styles.carouselButton}
            >
              ▶
            </button>
          </>
        ) : (
          <img
            src="placeholder-image-url"
            alt={`${team.name} placeholder`}
            className={styles.carouselImage}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.seperator} />
      <div className={styles.locationContainer}>
        <div className={styles.topSection}>
          <h1>{match.teams[0].name}</h1>
          <div className={styles.restaurantAttributes}>
            <h4>⭐️ {match.teams[0].rating}</h4>
            <h4>💵 {match.teams[0].price}</h4>
            <h4>
              💰 ${match.teams[0]?.price_range?.startPrice?.units ?? "N/A"} - $
              {match.teams[0]?.price_range?.endPrice?.units ?? "N/A"}
            </h4>
          </div>
          <a href={match.teams[0].website_url} target="_blank" rel="noreferrer">
            Website
          </a>
        </div>
        {renderCarousel("team1", match.teams[0])}
        <div className={styles.bottomSection}>
          <button onClick={() => handleSelect(match.teams[0])}>Choose</button>
        </div>
      </div>
      <div className={styles.seperator} />
      <div className={styles.locationContainer}>
        <div className={styles.topSection}>
          <h1>{match.teams[1].name}</h1>
          <div className={styles.restaurantAttributes}>
            <h4>⭐️ {match.teams[1].rating}</h4>
            <h4>💵 {match.teams[1].price}</h4>
            <h4>
              💰 ${match.teams[1]?.price_range?.startPrice?.units ?? "N/A"} - $
              {match.teams[1]?.price_range?.endPrice?.units ?? "N/A"}
            </h4>
          </div>
          <a href={match.teams[1].website_url} target="_blank" rel="noreferrer">
            Website
          </a>
        </div>
        {renderCarousel("team2", match.teams[1])}
        <div className={styles.bottomSection}>
          <button onClick={() => handleSelect(match.teams[0])}>Choose</button>
        </div>
      </div>
      <div className={styles.seperator} />
    </div>
  );
}

export default ShowdownScreen;
