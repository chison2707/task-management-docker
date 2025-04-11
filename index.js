const express = require('express');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

const routeApiV1 = require("./api/v1/routes/index.route");

const app = express()
const port = process.env.PORT;

app.use(cors());

app.use(cookieParser());

// parse application/json
app.use(bodyParser.json())

routeApiV1(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})