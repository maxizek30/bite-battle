import { createContext, useState } from "react";

export const RestaurantContext = createContext();
export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  return (
    <RestaurantContext.Provider value={{ restaurants, setRestaurants }}>
      {children}
    </RestaurantContext.Provider>
  );
};
