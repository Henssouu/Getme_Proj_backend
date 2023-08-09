const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  content: String,
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
