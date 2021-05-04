const express = require("express");
const router = express.Router();

router.post("/running", (req, res) => {
  const text = req.body.text;
  res.json({
    response_type: "in_channel",
    text: `Got it! ${text}`,
  });
});

router.post("/biking", (req, res) => {

});

router.post('/leaderboard', (req, res) => {
  
})

module.exports = router;
