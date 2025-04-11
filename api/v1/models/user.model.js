const pool = require('../../../config/pool');

module.exports.findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

module.exports.createUser = async (full_name, email, hashedPassword, token) => {
    await pool.query(
        'INSERT INTO users (full_name, email, password,token) VALUES ($1, $2, $3, $4)',
        [full_name, email, hashedPassword, token]
    );
};

module.exports.findByToken = async (token) => {
    const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);
    return result.rows[0];
};