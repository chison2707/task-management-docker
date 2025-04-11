const express = require('express');
const router = express.Router();

const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post('/register', controller.register);
router.get('/login', controller.login);
router.get('/infor', authMiddleware.requireAuth, controller.infor);
router.post('/password/forgot', controller.forgotPassword);

module.exports = router;