const userRoutes = require("./user.route");
const taskRoutes = require("./task.route");

const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + '/tasks', authMiddleware.requireAuth, taskRoutes);
    app.use(version + '/users', userRoutes);
}