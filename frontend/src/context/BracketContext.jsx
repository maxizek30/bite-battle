import { createContext, useState, useEffect } from "react";

// Create the context
export const BracketContext = createContext();

export const BracketProvider = ({ children }) => {
  // Load initial state from localStorage
  const loadStateFromStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Initialize state with localStorage values or defaults
  const [selectedWinners, setSelectedWinners] = useState(
    loadStateFromStorage("selectedWinners", {})
  );
  const [rounds, setRounds] = useState(loadStateFromStorage("rounds", []));
  const [currentRound, setCurrentRound] = useState(
    loadStateFromStorage("currentRound", 0)
  );

  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("selectedWinners", JSON.stringify(selectedWinners));
  }, [selectedWinners]);

  useEffect(() => {
    localStorage.setItem("rounds", JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem("currentRound", JSON.stringify(currentRound));
  }, [currentRound]);

  const generateNextRound = (winners) => {
    const seeds = winners.reduce((acc, winner, index) => {
      if (index % 2 === 0 && index + 1 < winners.length) {
        acc.push({
          id: index / 2 + 1,
          date: new Date().toDateString(),
          teams: [
            {
              name: winners[index].name,
              image_url: winners[index].image_url,
              categories: winners[index].categories,
              distance: winners[index].distance,
              rating: winners[index].rating,
              price: winners[index].price,
              location: winners[index].location,
            },
            {
              name: winners[index + 1].name,
              image_url: winners[index + 1].image_url,
              categories: winners[index + 1].categories,
              distance: winners[index + 1].distance,
              rating: winners[index + 1].rating,
              price: winners[index + 1].price,
              location: winners[index + 1].location,
            },
          ],
        });
      }
      return acc;
    }, []);

    return {
      title: `Round ${rounds.length + 1}`,
      seeds,
    };
  };

  const onSelectWinner = (matchId, winner) => {
    setSelectedWinners((prev) => ({
      ...prev,
      [currentRound]: {
        ...prev[currentRound],
        [matchId]: winner,
      },
    }));

    const currentRoundWinners = Object.values({
      ...selectedWinners[currentRound],
      [matchId]: winner,
    });

    if (currentRoundWinners.length === rounds[currentRound].seeds.length) {
      if (currentRoundWinners.length > 1) {
        const nextRound = generateNextRound(currentRoundWinners);
        setRounds((prevRounds) => [...prevRounds, nextRound]);
        setCurrentRound((prev) => prev + 1);
      } else {
        setWinner(currentRoundWinners[0]);
        console.log(winner);

        setIsModalOpen(true);
      }
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const resetTournament = () => {
    localStorage.removeItem("selectedWinners");
    localStorage.removeItem("rounds");
    localStorage.removeItem("currentRound");
    setSelectedWinners({});
    setRounds([]);
    setCurrentRound(0);
  };

  return (
    <BracketContext.Provider
      value={{
        onSelectWinner,
        rounds,
        setRounds,
        currentRound,
        setCurrentRound,
        selectedWinners,
        resetTournament,
        winner,
        isModalOpen,
        closeModal,
      }}
    >
      {children}
    </BracketContext.Provider>
  );
};
