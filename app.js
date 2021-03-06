require("dotenv").config();
require("./slack/init");
const express = require("express");
const slackCommands = require("./slack/commands/index");
const testAddDataEndpoint = require("./test_data");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  // App setting validation
  if (req.body.type === "url_verification") {
    res.send(req.body.challenge);
  }
});

// Add some data
app.get("/add", (req, res) => {});

app.use("/slack/commands", slackCommands);

app.use("/test", testAddDataEndpoint);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
  console.error(err.message, err.stack);
});

module.exports = app;
