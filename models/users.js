const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  email: String,
  password: String,
  token: String,
  nom: String,
  prenom: String,
  pseudo: String,
  sexe: String,
  adresse: String,
  animal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'animals' }],
  photo: String,
  abonnements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  abonnés: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  latitude: Number,
  longitude: Number,
  wantedNotice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'wantednotices' }], 
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' }],
});

const User = mongoose.model('users', usersSchema);

module.exports = User;
