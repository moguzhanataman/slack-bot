const express = require("express");
const User = require("../models/user");
const UserService = require("../services/user");
const router = express.Router();
const db = require("../utils/db");
const userService = new UserService();
const signVerification = require("../utils/sign-verification");

// Ensure requests coming from slack
router.use("/", signVerification);

router.post("/running", async (req, res) => {
  try {
    const { user_id, user_name, text } = req.body;

    // Create user if not exists
    const user = new User(user_id, user_name);
    await userService.createUser(user);

    console.log(text);
    res.json(ephemeralResponse(`Got it! ${text}`));
    debugger;
  } catch (err) {
    res.json(ephemeralResponse(`Error: ${err}`));
  }
});

router.post("/biking", async (req, res) => {
  try {
    const newUser = await userService.createUser(
      new User("U1235", "Oguzhan Ataman")
    );
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.json({ error: "cant create user" });
  }
});

router.post("/leaderboard", (req, res) => {});

// Everyone in the channel can see this response
function textResponse(msg) {
  return {
    response_type: "in_channel",
    text: msg,
  };
}

function markdownResponse(markdown) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: markdown,
        },
      },
    ],
  };
}

// Only command user sees the response
function ephemeralResponse(msg) {
  return {
    response_type: "ephemeral",
    text: msg,
  };
}

module.exports = router;
