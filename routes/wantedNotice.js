const express = require('express');
const router = express.Router();
const WantedNotice = require('../models/wantedNotice');
const User = require("../models/users")
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => {
  if (!checkBody(req.body, ['type', 'photo', 'taille', 'couleur', 'poil', 'sexe', 'description', 'reward', 'latitude', 'longitude'])) {
    return res.json({ result: false, error: 'Missing or empty fields' });
  }

  const newNotice = new WantedNotice({
    type: req.body.type,
    photo: req.body.photo,
    taille: req.body.taille,
    couleur: req.body.couleur,
    poil: req.body.poil,
    sexe: req.body.sexe,
    description: req.body.description,
    reward: req.body.reward,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });


  newNotice.save().then((data) => {
    // Récupérez l'ID de la wanted Notice nouvellement créé
    const noticeId = data._id;
    console.log('id notice', noticeId)


    // Récupérer le token de la collection user
     const userToken = req.body.token;
     console.log('token', userToken)

     // Mettre à jour le modèle User avec l'ID de la wanted Notice nouvellement créé
     
     User.updateOne(
        { token: userToken },
        { $push: {wantedNotice: noticeId } },
     ).then(data => { console.log("apres update", data)}) // 
    res.json({ result: true, wantedNotice: data });
  });
});

router.get('/all/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    WantedNotice.find() 
      // .populate('wantednotices')
      .then(data => {
        console.log(data)
        res.json({ result: true, data });
      });
  });
});

module.exports = router;
