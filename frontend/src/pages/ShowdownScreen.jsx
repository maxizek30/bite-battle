import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";
import styles from "../styles/ShowdownScreen.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function ShowdownScreen() {
  const { onSelectWinner } = useContext(BracketContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { match } = location.state;

  const [teamPhotos, setTeamPhotos] = useState({
    team1: [],
    team2: [],
  });

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchTeamPhotos = async (team) => {
          const photoReferences = team.photos?.map((photo) => photo.name) || [];
          const photoUrls = await Promise.all(
            photoReferences.map(async (photoReference) => {
              const response = await fetch(
                `${
                  import.meta.env.VITE_API_URL
                }/v1/places/photos?photoReference=${photoReference}&maxWidth=400`
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
        console.log("team1Photos", team1Photos);
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

  const renderCarousel = (teamKey, team) => {
    const photos = teamPhotos[teamKey] || [];
    const hasPhotos = photos.length > 0;

    return (
      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        navigation
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        className={styles.swiperContainer}
      >
        {hasPhotos ? (
          photos.map((photo, idx) => (
            <SwiperSlide className={styles.slide} key={idx}>
              <img
                src={photo}
                alt={`${team.name} photo ${idx + 1}`}
                className={styles.carouselImage}
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className={styles.slide}>
            <img
              src="placeholder-image-url"
              alt={`${team.name} placeholder`}
              className={styles.carouselImage}
            />
          </SwiperSlide>
        )}
      </Swiper>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.seperator} />
      <div className={`${styles.locationContainer} ${styles.flyInFromLeft}`}>
        <div className={styles.topSection}>
          <hgroup>
            <h4 className={styles.title}>{match.teams[0].name}</h4>
            <p className={styles.description}>{match.teams[0].description}</p>
          </hgroup>
          <div className={styles.restaurantAttributes}>
            <p className={styles.attributes}>⭐️ {match.teams[0].rating}</p>
            <p className={styles.attributes}>
              💰 ${match.teams[0]?.price_range?.startPrice?.units ?? "N/A"} - $
              {match.teams[0]?.price_range?.endPrice?.units ?? "N/A"}
            </p>
          </div>
        </div>
        <div className={styles.carousel}>
          {renderCarousel("team1", match.teams[0])}
        </div>
        <div className={styles.bottomSection}>
          <button onClick={() => handleSelect(match.teams[0])}>Choose</button>
        </div>
      </div>
      <div className={styles.seperator} />
      <div className={`${styles.locationContainer} ${styles.flyInFromRight}`}>
        <div className={styles.topSection}>
          <hgroup>
            <h4 className={styles.title}>{match.teams[1].name}</h4>
            <p className={styles.description}>{match.teams[1].description}</p>
          </hgroup>
          <div className={styles.restaurantAttributes}>
            <p className={styles.attributes}>⭐️ {match.teams[1].rating}</p>
            <p className={styles.attributes}>
              💰 ${match.teams[1]?.price_range?.startPrice?.units ?? "N/A"} - $
              {match.teams[1]?.price_range?.endPrice?.units ?? "N/A"}
            </p>
          </div>
        </div>
        <div className={styles.carousel}>
          {renderCarousel("team2", match.teams[1])}
        </div>
        <div className={styles.bottomSection}>
          <button onClick={() => handleSelect(match.teams[1])}>Choose</button>
        </div>
      </div>
      <div className={styles.seperator} />
    </div>
  );
}

export default ShowdownScreen;
