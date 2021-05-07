/**
 * Manage Slack API integration
 */

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");

// Create a Slack Web API client using the access token
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackAccessToken = process.env.SLACK_ACCESS_TOKEN;
if (!slackSigningSecret || !slackAccessToken) {
  throw new Error(
    "A Slack signing secret and access token are required to run this app."
  );
}

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackAccessToken);

module.exports = {
  slackEvents,
  slackClient,
};
