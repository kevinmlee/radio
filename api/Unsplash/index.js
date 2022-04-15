require("dotenv").config();
const https = require("https");
const BASE_URL = "https://api.unsplash.com/";

module.exports = {
  getWallpaper: async function (req, res, next) {
    const { genre, filter } = req.body;
    const url =
      BASE_URL +
      "/photos/random/?client_id=" +
      process.env.UNSPLASH_ACCESS_KEY +
      "&query=" +
      genre +
      "&orientation=landscape";

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
};
