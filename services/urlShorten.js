const crypto = require("crypto");
const base62Encoding = require("../utility/base62Encoding");
const pool = require("../config/db.config");
const { getRandomInt } = require("../utility/common");

const HASH_ALGORITHM = "md5";
const HASH_HEX_RADIX = 16;
const RANDOM_SLICE_INDEX_MAX = 31;

function buildShortCodeFromUrl(inputUrl) {
  const hash = crypto.createHash(HASH_ALGORITHM);
  hash.update(inputUrl);

  const hashHex = hash.digest("hex");
  const startIndex = getRandomInt(RANDOM_SLICE_INDEX_MAX);
  const endIndex = getRandomInt(RANDOM_SLICE_INDEX_MAX);
  const hashSegment = parseInt(hashHex.slice(startIndex, endIndex), HASH_HEX_RADIX);

  return base62Encoding.encodeToBase62(hashSegment);
}

function formatShortUrlResult(originalUrl, shortUrl, expireAt) {
  return {
    original_url: originalUrl,
    short_url: `${shortUrl}`,
    expire_at: expireAt,
  };
}

async function generateShortUrl(input_url, expiration) {
  const existingRecord = await checkIfUrlExists(input_url, "original");
  if (existingRecord) {
    return formatShortUrlResult(
      existingRecord.original_url,
      existingRecord.short_url,
      existingRecord.expire_at,
    );
  }

  const short_url = buildShortCodeFromUrl(input_url);

  const shortCodeCollision = await checkIfUrlExists(short_url, "short");
  if (shortCodeCollision && shortCodeCollision?.input_url === input_url) {
    return generateShortUrl(input_url, expiration);
  }

  await insertUrl(input_url, short_url, expiration);

  return formatShortUrlResult(input_url, short_url, expiration);
}

async function checkIfUrlExists(url, type) {
  const whereClause = type === "short" ? "short_url = $1" : "original_url = $1";
  const query = `SELECT * FROM url_shortner.urls WHERE ${whereClause}`;
  const values = [url];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function insertUrl(input_url, short_url, expiration) {
  const query =
    "INSERT INTO url_shortner.urls (original_url, short_url, expire_at) VALUES ($1, $2, $3)";
  const values = [input_url, short_url, expiration];
  const result = await pool.query(query, values);

  return result.rows[0];
}

module.exports = { generateShortUrl };
