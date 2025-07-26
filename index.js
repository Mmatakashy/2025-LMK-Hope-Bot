// main server code
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const verifyToken = require('./verifyToken');
const { SessionsClient } = require('@google-cloud/dialogflow');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const DIALOGFLOW_PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID;

app.get('/webhook', verifyToken);

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const userMessage = webhookEvent.message.text;
        const dialogflowResponse = await sendToDialogflow(userMessage, senderId);
        const reply = dialogflowResponse.fulfillmentText || "Sorry, I didn't get that.";
        await sendMessage(senderId, reply);
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Send user message to Dialogflow
async function sendToDialogflow(message, sessionId) {
  const sessionClient = new SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(DIALOGFLOW_PROJECT_ID, sessionId);

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

// Send reply to Facebook Messenger
async function sendMessage(recipientId, messageText) {
  const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  const payload = {
    recipient: { id: recipientId },
    message: { text: messageText },
  };

  try {
    await axios.post(url, payload);
    console.log(`Message sent to ${recipientId}: ${messageText}`);
  } catch (error) {
    console.error('Unable to send message:', error.response ? error.response.data : error.message);
  }
}

// Start your app
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});
