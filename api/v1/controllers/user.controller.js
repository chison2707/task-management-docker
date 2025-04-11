const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const saltRounds = 10;
const generateHelper = require('../helpers/generate.js');

// [POST]/api/v1/users/register
module.exports.register = async (req, res) => {
    const { full_name, email, password } = req.body;
    const EsistUser = await User.findByEmail(email);
    if (EsistUser) {
        return res.json({
            code: 400,
            message: 'Email đã tồn tại'
        });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const token = generateHelper.generateRandomString(30);

    await User.createUser(full_name, email, hashedPassword, token);
    return res.json({
        code: 200,
        message: 'Đăng ký thành công'
    });
}

// [GET]/api/v1/users/login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
        return res.json({
            code: 400,
            message: 'Email không tồn tại'
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({
            code: 400,
            message: 'Mật khẩu không chính xác'
        });
    }
    const token = user.token;
    res.cookie("token", token);

    return res.json({
        code: 200,
        message: 'Đăng nhập thành công',
        token: token,
    });
}