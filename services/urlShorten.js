const crypto = require("crypto");
const base62 = require("base62"); // not using existing base62 library
const base62Encoding = require("../utility/base62Encoding");
const pool = require("../config/db.config");

async function generateShortUrl(input_url, expiration) {
    const hash = crypto.createHash("md5");
    hash.update(input_url);
    // console.log(hash.digest("hex"));
    const short_url = base62Encoding.encodeToBase62(parseInt(hash.digest("hex").slice(0, 8), 16));
    // const urlExists = await checkIfUrlExists(input_url, short_url);
    // if (urlExists) {
    //     // rerun the hash and encoding
    //     return generateShortUrl(input_url, expiration);
    // }
    // await insertUrl(input_url, short_url, expiration);
    // const originalUrl = new URL(input_url);
    // const baseUrl =  `${originalUrl.host}`;
    return {
      original_url: input_url,
      short_url: `${short_url}`,
      expire_at: expiration
    }
}
async function checkIfUrlExists(input_url, short_url) {
    const query = `SELECT * FROM url_shortner.urls WHERE original_url, short_url = $1, $2`;
    const values = [input_url, short_url];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function insertUrl(input_url, short_url, expiration) {
    const query = `INSERT INTO url_shortner.urls (original_url, short_url, expire_at) VALUES ($1, $2, $3)`;
    const values = [input_url, short_url, expiration];
    const result = await pool.query(query, values);
    return result.rows[0];
}


module.exports = {generateShortUrl};