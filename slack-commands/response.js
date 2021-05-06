// Response

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

module.exports = {
  textResponse,
  markdownResponse,
  ephemeralResponse,
};
