
const mongoose = require('mongoose');

const animalsSchema = mongoose.Schema({
type: String,
nom: String,
taille: String,
couleur: String,
poil: String,
sexe: String,
castré: String,
tatouage: String,
puce: String,
description: String,
animalPhoto: String,
});

const Animal = mongoose.model('animals', animalsSchema);

module.exports = Animal;