
const mongoose = require('mongoose');

const animalsSchema = mongoose.Schema({
type: String,
nom: String,
photo: String,
taille: String,
couleur: String,
pelage: String,
sexe: String,
castré: Boolean,
tatouage: Boolean,
puce: Boolean,
birthday: Date,
description: String,


});

const Animal = mongoose.model('animals', animalsSchema);

module.exports = Animal;