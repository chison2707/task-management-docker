const pool = require('../../../config/pool');

module.exports.createForgotPass = async (user_id, email, otp, expire_at) => {
    await pool.query(
        'INSERT INTO forgot_passwords (user_id, email, otp,expire_at) VALUES ($1, $2, $3, $4)',
        [user_id, email, otp, expire_at]
    );
};