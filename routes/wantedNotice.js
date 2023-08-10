const express = require('express');
const router = express.Router();
const WantedNotice = require('../models/wantedNotice');
const User = require("../models/users")
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => {
  if (!checkBody(req.body, ['type', 'taille', 'couleur', 'poil'])) {
    return res.json({ result: false, error: 'Missing or empty fields' });
  }

  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

  const newNotice = new WantedNotice({
    type: req.body.type,
    wantedNoticePhoto: req.body.wantedNoticePhoto,
    taille: req.body.taille,
    couleur: req.body.couleur,
    poil: req.body.poil,
    sexe: req.body.sexe,
    description: req.body.description,
    reward: req.body.reward,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    author: user._id,
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
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    const minLatitude = req.query.minLatitude;
    const maxLatitude = req.query.maxLatitude;
    const minLongitude = req.query.minLongitude;
    const maxLongitude = req.query.maxLongitude;

    WantedNotice.find({
      latitude: { $gte: minLatitude, $lte: maxLatitude },
      longitude: { $gte: minLongitude, $lte: maxLongitude }
    }).populate('author', ['pseudo'])
      .then(data => {
        console.log(data);
        res.json({ result: true, data });
      })
      .catch(error => {
        console.error('Error fetching wanted notices:', error);
        res.json({ result: false, error: 'Error fetching wanted notices' });
      });
    });
  });
});

router.delete('/', (req, res) => {
  if (!checkBody(req.body, ['token', 'noticeId'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    WantedNotice.findById(req.body.noticeId)
      .populate('author')
      .then(notice => {
        if (!notice) {
          res.json({ result: false, error: 'Notice not found' });
          return;
        } else if (String(notice.author._id) !== String(user._id)) { // On transforme les ObjectID en String car JS ne peux pas comparer deux objets.
          res.json({ result: false, error: 'Notice can only be deleted by its author' });
          return;
        }

        WantedNotice.deleteOne({ _id: notice._id }).then(() => {
          res.json({ result: true });
        });
      });
  });
});


module.exports = router;
