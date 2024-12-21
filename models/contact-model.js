const pool = require("../database/");

async function saveContactMessage(user_firstname, user_lastname, user_email, user_phone, message_subject, message_content) {
    try {
        const sql = "INSERT INTO contact_message (user_firstname, user_lastname, user_email, user_phone, message_subject, message_content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
        return await pool.query(sql, [user_firstname, user_lastname, user_email, user_phone, message_subject, message_content]);
    } catch (err) {
        throw new Error('Error saving contact message: ' + err.message);
    }
}

module.exports = { saveContactMessage };