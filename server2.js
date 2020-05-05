require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
//Init app
const app = express();
app.use(bodyParser.json());

app.post("/login", (req, res) => {
    const name = req.body.username;
    const token = jwt.sign({
        name
    }, process.env.ACCESS_TOKEN_SECRET);
    res.json({
        token
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up and Running on port - ${port}`);
});

function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if (err) return res.sendStatus(403);
        req.user = authData;
        next();
    });
}