const express = require("express");
const TaskService = require("./services/task");
const handleTask = require("./slack/commands/task");
const router = express.Router();

// Sends predefined list of objects as a seperate task and responds with OK
router.get("/add-test-data", async (req, res) => {
  // Only works in development
  if (req.app.get("env") !== "development") {
    return res.send(500);
  }

  /*
    Data summary in this array
    =================================
    U1 running 15 
    U1 biking  5  most active running
    ---------------------------------
    U2 running 20
    U2 biking  30 most active biking
    --------------------------------
    U3 biking  15 most active biking
  */
  [
    {
      user_id: "U1",
      user_name: "test_account_1",
      text: "5",
      command: "/running",
    },
    {
      user_id: "U1",
      user_name: "test_account_1",
      text: "10",
      command: "/running",
    },
    {
      user_id: "U1",
      user_name: "test_account_1",
      text: "5",
      command: "/biking",
    },

    {
      user_id: "U2",
      user_name: "test_account_2",
      text: "20",
      command: "/running",
    },
    {
      user_id: "U2",
      user_name: "test_account_2",
      text: "30",
      command: "/biking",
    },
    {
      user_id: "U3",
      user_name: "test_account_3",
      text: "5",
      command: "/biking",
    },
    {
      user_id: "U3",
      user_name: "test_account_3",
      text: "10",
      command: "/biking",
    },
  ].forEach(async (x) => {
    try {
      const task = await TaskService.createTask(
        x.user_id,
        x.user_name,
        x.command.substring(1),
        x.text
      );
    } catch (err) {
      console.error("adding test data error", err);
    }
  });
  res.send(200);
});

module.exports = router;
