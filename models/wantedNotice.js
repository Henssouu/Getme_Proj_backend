const mongoose = require('mongoose');

const wantedNoticeSchema = mongoose.Schema({
    type: String,
    photo: String,
    taille: String,
    couleur: String,
    poil: String,
    sexe: String,
    description: String,
    reward: String,
    latitude: Number,
    longitude: Number,
});

const WantedNotice = mongoose.model('wantednotices', wantedNoticeSchema);

module.exports = WantedNotice;
