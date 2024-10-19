import { useContext, useEffect } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";
import styles from "../styles/Bracket.module.css";

function BracketComponent() {
  const { restaurants } = useContext(RestaurantContext);
  const { rounds, setRounds } = useContext(BracketContext);
  const { selectedWinners } = useContext(BracketContext);
  const { currentRound } = useContext(BracketContext);
  const { resetTournament } = useContext(BracketContext);

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
            teams: [
              {
                name: array[index].name,
                image_url: array[index].image_url,
                categories: array[index].categories,
                distance: array[index].distance,
                rating: array[index].rating,
                price: array[index].price,
              },
              {
                name: array[index + 1].name,
                image_url: array[index + 1].image_url,
                categories: array[index + 1].categories,
                distance: array[index + 1].distance,
                rating: array[index + 1].rating,
                price: array[index + 1].price,
              },
            ],
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

      {rounds.length > 0 ? (
        <div className={styles.bracketDiv}>
          <Bracket
            roundClassName={styles.bracketContainer}
            rounds={rounds}
            renderSeedComponent={(props) =>
              customSeed({ ...props, roundIndex: props.roundIndex })
            }
          />
        </div>
      ) : (
        <p>No restaurants found or data still loading...</p>
      )}
    </div>
  );
}

export default BracketComponent;
