const User = require('../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const user = await User.findByToken(token);
        if (!user) {
            res.json({
                code: 400,
                message: 'Token không hợp lệ'
            });
            return;
        }
        req.user = user;
        next();
    } else {
        res.json({
            code: 400,
            message: 'Vui lòng gửi kèm token'
        });
    }
}