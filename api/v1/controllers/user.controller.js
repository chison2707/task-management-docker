const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const saltRounds = 10;
const generateHelper = require('../helpers/generate.js');
const sendMailHelper = require('../helpers/sendmail.js');
const ForgotPassword = require('../models/forgot-password.model.js');

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

// [GET]/api/v1/users/infor
module.exports.infor = async (req, res) => {
    return res.json({
        code: 200,
        message: 'Thông tin người dùng',
        user: req.user
    });
}

// [POST]/api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findByEmail(email);

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        });
    }

    const otp = generateHelper.generateRandomNumber(6);

    await ForgotPassword.createForgotPass(user.id, email, otp, new Date(Date.now() + 5 * 60 * 1000));

    // gửi otp qua email user
    const subject = "Mã OTP để lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>.
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email, subject, html);
    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    });
};

// [POST]/api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOtp(email, otp);

    if (!result) {
        return res.json({
            code: 400,
            message: "Mã OTP không đúng"
        });
    }

    if (new Date(result.expire_at) < new Date(Date.now())) {
        await ForgotPassword.deleteOtp();
        return res.json({
            code: 400,
            message: "Mã OTP đã hết hạn"
        });
    }

    const user = await User.findByEmail(email);

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xác thực thành công!",
        token: token
    });
};