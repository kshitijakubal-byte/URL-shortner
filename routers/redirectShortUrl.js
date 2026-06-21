const express = require("express");
const redirectShortUrlController = require("../controllers/redirectShortUrl");

const redirectRoutes = express.Router();
redirectRoutes.get("/redirect/:shortCode", redirectShortUrlController.redirectToUrl);


module.exports = {
  redirectRoutes
};
