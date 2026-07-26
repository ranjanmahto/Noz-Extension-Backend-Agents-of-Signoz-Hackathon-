const express = require('express');
const { processChat } = require('../services/chatService');

const chatRouter = express.Router();

chatRouter.post('/ask', async (req, res) => {
  try {
    const response = await processChat(req.body.messages);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = chatRouter;