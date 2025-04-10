const express = require('express');
const mainV1Routes = require("./api/v1/routes/index.route");
const app = express();
const port = 3000;

app.use(express.json());
mainV1Routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})