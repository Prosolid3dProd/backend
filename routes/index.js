const express = require("express");
const app = express();

//auth
app.use(require("./ardis/index.js"));

module.exports = app;
