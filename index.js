require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const verifyToken = require('./verifyToken');

const app = express();
app.use(bodyParser.json());
async function sendToDialogflow(message, sessionId) {
  const dialogflow = require('@google-cloud/dialogflow');
  const sessionClient = new dialogflow.SessionsClient();

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
}

async function sendMessage(senderId, text) {
  const url = https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN};

  const messageData = {
    recipient: { id: senderId },
    message: { text },
  };

  try {
    await axios.post(url, messageData);
  } catch (error) {
    console.error("Facebook API error:", error.response?.data || error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  //console.log(Server is listening on port ${PORT});
});