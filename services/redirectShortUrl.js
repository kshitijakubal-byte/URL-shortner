const pool = require("../config/db.config");
async function getUrlByShortCode(shortCode) {
  const query = `SELECT * FROM url_shortner.urls WHERE short_url = $1`;
  const values = [shortCode];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

module.exports = { getUrlByShortCode };