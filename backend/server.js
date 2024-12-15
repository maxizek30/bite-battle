require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");

const allowedOrigin = process.env.ALLOWED_ORIGIN;

console.log("Allowed Origin:", allowedOrigin);

// Middleware
app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
app.use(express.json()); // To parse JSON request bodies

app.post("/v1/places:searchNearby", async (req, res) => {
  const { latitude, longitude, radius, includedTypes } = req.body;

  if (!latitude || !longitude || !radius || !includedTypes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const requestBody = {
    includedTypes,
    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius,
      },
    },
  };

  const url = `https://places.googleapis.com/v1/places:searchNearby?fields=places.displayName,places.rating,places.websiteUri,places.googleMapsUri,places.formattedAddress,places.photos,places.priceLevel,places.priceRange,places.location,places.generativeSummary&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching data from Google Places API:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to fetch data from Google Places API" });
  }
});
app.get("/v1/places/photos", async (req, res) => {
  const { photoReference, maxWidth, maxHeight } = req.query;

  if (!photoReference) {
    return res.status(400).send("photoReference is required.");
  }
  try {
    // Construct the API URL
    const url = `https://places.googleapis.com/v1/${photoReference}/media?key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const params = {};
    if (maxWidth) params.maxWidthPx = maxWidth;
    if (maxHeight) params.maxHeightPx = maxHeight;

    params.skipHttpRedirect = true;

    // Make the API request
    const response = await axios.get(url, {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json({
      photoUri: response.data.photoUri,
    });
  } catch (error) {
    console.error("Error fetching photo from Google Places API", error);
    res.status(500).send("Error fetching photo from Google Places API");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
