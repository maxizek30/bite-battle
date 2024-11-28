require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const port = 8000;
const cors = require("cors");
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Route to handle search for nearby places
// app.post("/v1/places:searchNearby", async (req, res) => {
//   const { latitude, longitude, radius, includedTypes } = req.body;

//   const requestBody = {
//     includedTypes: includedTypes || ["restaurant"],
//     locationRestriction: {
//       circle: {
//         center: {
//           latitude: latitude || 47.17754,
//           longitude: longitude || -122.43033,
//         },
//         radius: radius || 4000,
//       },
//     },
//   };

//   try {
//     const response = await axios.post(
//       `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.GOOGLE_PLACES_API_KEY}&fields=places.displayName,places.types,places.rating,places.websiteUri,places.photos,places.priceLevel,places.priceRange`,
//       requestBody,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching data from Google Places API", error);
//     res.status(500).send("Error fetching data from Google Places API");
//   }
// });
app.post("/v1/places:searchNearby", (req, res) => {
  try {
    const mockDataPath = path.join(__dirname, "exampleNewData.json");
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf8"));
    console.log("returning mock data");
    res.json(mockData);
  } catch (error) {
    console.error("Error reading mock data", error);
    res.status(500).send("Error reading mock data");
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
