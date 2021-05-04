/**
 * Manage Slack API integration
 */

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");

// Create a Slack Web API client using the access token
let _slackEvents;
let _slackClient;

function init() {
  // Read the signing secret and access token from the environment variables
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
  const slackAccessToken = process.env.SLACK_ACCESS_TOKEN;
  if (!slackSigningSecret || !slackAccessToken) {
    throw new Error(
      "A Slack signing secret and access token are required to run this app."
    );
  }

  _slackEvents = createEventAdapter(slackSigningSecret);
  _slackClient = new WebClient(slackAccessToken);
}

function getSlackEvents() {
  return _slackEvents;
}

function getSlackClient() {
  return _slackClient;
}

module.exports = {
  init,
  getSlackClient,
  getSlackEvents,
}