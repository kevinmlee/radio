require("dotenv").config();
const https = require("https");
const BASE_URL = "https://api.spotify.com";

const axios = require("axios");
const qs = require("qs");

module.exports = {
  auth: async function (req, res, next) {
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID,
        password: process.env.SPOTIFY_CLIENT_SECRET,
      },
    };
    const data = { grant_type: "client_credentials" };
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        qs.stringify(data),
        headers
      );

      res.json(response.data);
    } catch (err) {
      console.log(err);
    }
  },

  getGenres: async function (req, res, next) {
    const { token } = req.body;

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axios.get(
        BASE_URL + "/v1/recommendations/available-genre-seeds",
        { headers }
      );
      res.json(data);
    } catch (err) {
      console.log(err);
    }
  },

  getRecommendations: async function (req, res, next) {
    const { genre, token } = req.body;

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axios.get(
        BASE_URL + "/v1/recommendations?limit=10&seed_genres=" + genre,
        { headers }
      );
      res.json(data);
    } catch (err) {
      console.log(err);
    }
  },
};
