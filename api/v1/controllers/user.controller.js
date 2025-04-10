const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const saltRounds = 10;
const generateHelper = require('../helpers/generate.js');

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