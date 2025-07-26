<<<<<<< HEAD
// main server code
=======
>>>>>>> edd9cddeea612e58f6c5793ed6032178c2cc8a7c
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const verifyToken = require('./verifyToken');
<<<<<<< HEAD
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
=======

const app = express();
app.use(bodyParser.json());
async function sendToDialogflow(message, sessionId) {
  const dialogflow = require('@google-cloud/dialogflow');
  const sessionClient = new dialogflow.SessionsClient();

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );
>>>>>>> edd9cddeea612e58f6c5793ed6032178c2cc8a7c

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

<<<<<<< HEAD
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
=======
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
>>>>>>> edd9cddeea612e58f6c5793ed6032178c2cc8a7c
