const userRoutes = require("./user.route");

// import * as userMiddleware from "../../middlewares/client/use.middleware";
// import { requireAuth } from "../../middlewares/client/auth.middleware";

module.exports = (app) => {
    // app.use(userMiddleware.infoUser);
    const version = "/api/v1";

    app.use(version + '/users', userRoutes);
}