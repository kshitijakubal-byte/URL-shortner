const express = require("express");
const urlShortenController = require("../controllers/urlShorten");

const apiRoutes = express.Router();
apiRoutes.post("/shorten", urlShortenController.shortenUrl);


module.exports = {
  apiRoutes,
};
