const express = require('express');
const router = express.Router();
const Message = require('../models/messages'); 


router.post('/send-message', async (req, res) => {
    const { sender, receiver, content } = req.body;
  
    try {
      // Create a new message
      const message = new Message({
        sender,
        receiver,
        content,
      });
  
      // Save the message to the database
      await message.save();
  
      res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
  });

  router.get('/get-messages/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find all messages where the user is either the sender or the receiver
      const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate('sender', 'username email') // Populate the sender field with username and email
        .populate('receiver', 'username email'); // Populate the receiver field with username and email
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
  });

  router.post('/reply-message/:messageId', async (req, res) => {
  const { sender, content } = req.body;
  const messageId = req.params.messageId;

  try {
    // Create a new reply message
    const replyMessage = new Message({
      sender,
      content,
    });

    // Save the reply message to the database
    await replyMessage.save();

    // Find the original message and update its replies field
    const originalMessage = await Message.findById(messageId);
    originalMessage.replies.push(replyMessage);
    await originalMessage.save();

    res.status(201).json({ message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ error: 'An error occurred while sending the reply.' });
  }
});

  

  module.exports = router;