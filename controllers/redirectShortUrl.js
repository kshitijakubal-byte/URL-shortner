const { z } = require("zod");
const redirectShortUrlService = require("../services/redirectShortUrl");

async function redirectToUrl(req, res) {
  try {
    const { shortCode } = req.params;
    const record = await redirectShortUrlService.getUrlByShortCode(shortCode);
    if (!record) {
      return res.status(404).json({ error: "Short URL not found or expired" });
    }
    return res.redirect(301, record.original_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ error: "Failed to redirect" });
  }
}

module.exports = {
  redirectToUrl
};