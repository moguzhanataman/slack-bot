const express = require("express");
const Task = require("../models/task");
const User = require("../models/user");
const TaskService = require("../services/task");
const UserService = require("../services/user");
const CommandService = require("../services/command");
const router = express.Router();
const db = require("../utils/db");
const signVerification = require("../utils/sign-verification");

const userService = new UserService();
const taskService = new TaskService();
const commandService = new CommandService();

// Ensure requests coming from slack
router.use("/", signVerification);

router.post("/running", async (req, res) => {
  try {
    const { user_id, user_name, text } = req.body;

    // Create user if not exists
    const user = new User(user_id, user_name);
    await userService.createUser(user);

    // Get command TODO: can be improved by caching commands
    const command = await commandService.getCommandByName("running");

    // Create task
    const value = parseInt(text, 10);
    const task = new Task(command.id, user.id, value, new Date());
    const taskResult = await taskService.createTask(task);

    if (taskResult != null) {
      console.log("taskResult, value", taskResult);
      res.json(ephemeralResponse(`Got it! ${taskResult.value}`));
    } else {
      res.json(ephemeralResponse(`Can't save task to database`));
    }
  } catch (err) {
    res.json(ephemeralResponse(`${err}`));
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
