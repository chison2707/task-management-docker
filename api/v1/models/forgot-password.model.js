const pool = require('../../../config/pool');

module.exports.createForgotPass = async (user_id, email, otp, expire_at) => {
    await pool.query(
        'INSERT INTO forgot_passwords (user_id, email, otp,expire_at) VALUES ($1, $2, $3, $4)',
        [user_id, email, otp, expire_at]
    );
};

module.exports.findOtp = async (email, otp) => {
    const result = await pool.query('SELECT * FROM forgot_passwords WHERE email = $1 AND otp = $2', [email, otp]);
    return result.rows[0];
};

module.exports.deleteOtp = async () => {
    await pool.query('DELETE FROM forgot_passwords WHERE expire_at < $1', [new Date(Date.now())]);
};