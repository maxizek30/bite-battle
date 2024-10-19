require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = 8000;
const cors = require("cors");
const exampleData = require("./exampleData");

app.use(cors());

app.get("/api/restaurants", async (req, res) => {
  const { latitude, longitude } = req.query;
  console.log("Fetching restaurants");

  try {
    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&sort_by=best_match&limit=16&categories=restaurants`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
      }
    );
    res.json(response.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.json(exampleData);
  } catch (error) {
    res.status(500).send("Error fetching data from Yelp");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
