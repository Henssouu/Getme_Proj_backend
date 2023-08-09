const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    createdAt: Date,
  });
  
  const Post = mongoose.model('posts', postSchema);
  
  module.exports = Post;