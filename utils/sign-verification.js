/**
 * Taken from: https://medium.com/@rajat_sriv/verifying-requests-from-slack-using-node-js-69a8b771b704
 *
 * This middleware ensures that we are getting commands from Slack.
 * If we don't use this, anyone with correct URL can trigger slash commands.
 */
const crypto = require("crypto");
const qs = require("qs");
// fetch this from environment variables
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
let signVerification = (req, res, next) => {
  let slackSignature = req.headers["x-slack-signature"];
  let requestBody = qs.stringify(req.body, { format: "RFC1738" });
  let timestamp = req.headers["x-slack-request-timestamp"];

  if (slackSignature == null || timestamp == null) {
    return res.status(400).send("Slack headers missing");
  }

  let time = Math.floor(new Date().getTime() / 1000);
  if (Math.abs(time - timestamp) > 300) {
    return res.status(400).send("Ignore this request.");
  }
  if (!slackSigningSecret) {
    return res.status(400).send("Slack signing secret is empty.");
  }
  let sigBasestring = "v0:" + timestamp + ":" + requestBody;
  let mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", slackSigningSecret)
      .update(sigBasestring, "utf8")
      .digest("hex");
  if (
    crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(slackSignature, "utf8")
    )
  ) {
    next();
  } else {
    return res.status(400).send("Verification failed");
  }
};
module.exports = signVerification;
