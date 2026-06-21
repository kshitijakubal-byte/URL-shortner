const { z } = require("zod");
const urlShortenService = require("../services/urlShorten");

const shortenSchema = z.object({
  url: z.url({ message: "Invalid URL" }),
  expireAt: z.coerce.date().optional(),
});

const shortenUrl = async (req, res) => {
  try {
    const parsed = shortenSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: parsed.error.issues,
      });
    }

    const { url, expireAt } = parsed.data;

    const result = await urlShortenService.generateShortUrl(url, expireAt);
    // const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    return res.status(201).json({
      originalUrl: result.original_url,
      shortUrl: result.short_url,
      shortCode: result.short_url,
      expiresAt: result.expire_at,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return res.status(500).json({ error: "Failed to shorten URL" });
  }
};

const redirectToUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const record = await urlShortenService.getUrlByShortCode(shortCode);

    if (!record) {
      return res.status(404).json({ error: "Short URL not found or expired" });
    }

    return res.redirect(301, record.original_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ error: "Failed to redirect" });
  }
};

module.exports = {
  shortenUrl,
  redirectToUrl,
};
