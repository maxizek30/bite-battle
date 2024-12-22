import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LocationPage from "./pages/LocationPage.jsx";
import { RestaurantProvider } from "./context/RestaurantContext.jsx";
import BracketComponent from "./pages/Bracket.jsx";
import ShowdownScreen from "./pages/ShowdownScreen.jsx";
import { BracketProvider } from "./context/BracketContext.jsx";
import "@picocss/pico/css/pico.min.css";
import PageNotFound from "./pages/PageNotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LocationPage />,
  },
  {
    path: "/bracket",
    element: <BracketComponent />,
  },
  {
    path: "/showdown",
    element: <ShowdownScreen />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BracketProvider>
      <RestaurantProvider>
        <RouterProvider router={router} />
      </RestaurantProvider>
    </BracketProvider>
  </StrictMode>
);
