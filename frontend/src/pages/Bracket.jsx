import { useContext, useEffect } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { useNavigate } from "react-router-dom";
import { BracketContext } from "../context/BracketContext";

function BracketComponent() {
  const { restaurants } = useContext(RestaurantContext);
  const { rounds, setRounds } = useContext(BracketContext);
  const { selectedWinners } = useContext(BracketContext);
  const { currentRound } = useContext(BracketContext);
  const { resetTournament } = useContext(BracketContext);

  const navigate = useNavigate();

  const styles = {
    bracketContainer: {
      backgroundColor: "grey",
      width: "50%",
    },
  };

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
          title: "Round One",
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
        >
          <div onClick={() => !isPastRound && startShowdown(seed)}>
            {/* Only allow click if it's not a past round */}
            <SeedTeam
              style={{
                fontSize: 12,
                backgroundColor: isTeamOneSelected ? "lightgreen" : "black",
              }}
            >
              {seed.teams[0]?.name}
            </SeedTeam>
            <div style={{ height: 1, backgroundColor: "white" }} />
            <SeedTeam
              style={{
                fontSize: 12,
                backgroundColor: isTeamTwoSelected ? "lightgreen" : "black",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Bracket</h1>
        <button
          onClick={() => {
            navigate("/");
            resetTournament();
          }}
        >
          Go Back
        </button>
      </div>

      {rounds.length > 0 ? (
        <div>
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
