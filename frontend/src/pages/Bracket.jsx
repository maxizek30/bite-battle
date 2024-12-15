import { useContext, useEffect } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import { Bracket, Seed, SeedItem, SeedTeam } from "@pawix/react-brackets";
import { useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";
import styles from "../styles/Bracket.module.css";

function BracketComponent() {
  const { restaurants } = useContext(RestaurantContext);
  const { rounds, setRounds } = useContext(BracketContext);
  const { selectedWinners } = useContext(BracketContext);
  const { currentRound } = useContext(BracketContext);
  const { resetTournament } = useContext(BracketContext);
  const { winner, isModalOpen, closeModal } = useContext(BracketContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      Array.isArray(restaurants) &&
      restaurants.length > 0 &&
      rounds.length === 0
    ) {
      const seeds = restaurants.reduce((acc, restaurant, index, array) => {
        if (index % 2 === 0 && index + 1 < array.length) {
          acc.push({
            id: index / 2 + 1,
            date: new Date().toDateString(),
            teams: [array[index], array[index + 1]],
          });
        }
        return acc;
      }, []);
      const roundStructure = [
        {
          title: "Round 1",
          seeds,
        },
      ];
      console.log("setting round structure");
      console.log(restaurants);
      setRounds(roundStructure);
    }
  }, [restaurants]);

  const startShowdown = (match) => {
    navigate("/showdown", { state: { match } });
  };
  useEffect(() => {
    console.log("Rounds structure:", rounds);
  }, [rounds]);

  const customSeed = ({ seed, roundIndex }) => {
    const isTeamOneSelected =
      selectedWinners[roundIndex]?.[seed.id]?.name === seed.teams[0]?.name;
    const isTeamTwoSelected =
      selectedWinners[roundIndex]?.[seed.id]?.name === seed.teams[1]?.name;

    const isPastRound = roundIndex < currentRound;

    return (
      <Seed>
        <SeedItem
          style={{
            cursor: isPastRound ? "not-allowed" : "pointer", // Change cursor for past rounds
            opacity: isPastRound ? 0.6 : 1, // Dim past rounds
          }}
          styles={styles.showdownContainer}
        >
          <div onClick={() => !isPastRound && startShowdown(seed)}>
            {/* Only allow click if it's not a past round */}
            <SeedTeam
              className={`${styles.showdown} ${
                isTeamOneSelected ? styles.selectedTeam : ""
              }`}
              style={{
                backgroundColor: isTeamOneSelected ? "green" : "", // Inline className only for selected
              }}
            >
              {seed.teams[0]?.name}
            </SeedTeam>
            <div className={styles.showdownSeperator} />
            <SeedTeam
              className={`${styles.showdown} ${
                isTeamTwoSelected ? styles.selectedTeam : ""
              }`}
              style={{
                backgroundColor: isTeamTwoSelected ? "green" : "", // Inline className only for selected
              }}
            >
              {seed.teams[1]?.name}
            </SeedTeam>
          </div>
        </SeedItem>
      </Seed>
    );
  };

  return (
    <div className="container">
      <div className={styles.topArea}>
        <button
          onClick={() => {
            navigate("/");
            resetTournament();
          }}
          className="outline secondary"
        >
          Back
        </button>
        <h1>Bite Battle</h1>
        <button
          onClick={() => {
            navigate("/");
            resetTournament();
          }}
          style={{ visibility: "hidden" }}
        >
          Info
        </button>
      </div>

      {restaurants.length < 16 ? (
        <div className={styles.alternativeMessage}>
          <h2>Not Enough Restaurants</h2>
          <p>
            Please add more restaurants to start a tournament. You need at least
            16 restaurants to proceed.
          </p>
          <button onClick={() => navigate("/")}>Add Restaurants</button>
        </div>
      ) : rounds.length > 0 ? (
        <div className={styles.bracketDiv}>
          <Bracket
            roundClassName={styles.bracketContainer}
            rounds={rounds}
            renderSeedComponent={(props) =>
              customSeed({ ...props, roundIndex: props.roundIndex })
            }
            mobileBreakpoint={0}
          />
        </div>
      ) : (
        <p>No restaurants found or data still loading...</p>
      )}

      <dialog id="winnerModal" open={isModalOpen}>
        <article>
          <header>
            <h2>Good Choice!</h2>
          </header>
          {winner ? (
            <>
              <h1>{winner.name}</h1>
              <p>{winner.description}</p>
              <h3>Drive there!</h3>
              <address>{winner.address}</address>
              <a href={winner.google_maps_url} target="_blank" rel="noreferrer">
                Open with Google Maps
              </a>
            </>
          ) : (
            <p>There was an error selecting a winner. Please try again.</p>
          )}

          <footer>
            <button className="secondary" onClick={closeModal}>
              Close
            </button>
          </footer>
        </article>
      </dialog>
    </div>
  );
}

export default BracketComponent;
