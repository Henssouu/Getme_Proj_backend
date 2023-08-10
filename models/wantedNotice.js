const mongoose = require('mongoose');

const wantedNoticeSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: String,
    wantedNoticePhoto: String,
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
