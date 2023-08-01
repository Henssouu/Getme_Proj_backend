var express = require('express');
var router = express.Router();
const User = require("../models/users");
const {checkBody} = require("../modules/checkBody");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/signup', (req,res) => {
  if (!checkBody(req.body, ['email','password', 'birthday'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({email: req.body.email}).then(data => {
    if(data === null){
const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        birthday: req.body.birthday,
        token: uid2(32),
        
      });
      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token});
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req,res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) { //bcrypt.compareSync sert à comparer le mdp crypté avec celui rentré en dur lors de la connexion
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.post('/:token', (req,res) => {
  if(!checkBody(req.body, ['nom', 'prenom', 'pseudo', 'adresse'])){
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.updateOne(
    {token: req.params.token},
  
      {nom: req.body.nom, prenom: req.body.prenom, pseudo: req.body.pseudo, adresse: req.body.adresse}
   
    )
    .then(() => {
      res.json({result : true})

      });
  });




    



module.exports = router;
