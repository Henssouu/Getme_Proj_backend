var express = require('express');
var router = express.Router();
const User = require("../models/users");
const {checkBody} = require("../modules/checkBody");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');


/* GET users listing. */
router.post('/signup', (req,res) => {
  if (!checkBody(req.body, ['email','password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({email: req.body.email}).then(data => {
    if(data === null){
const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
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

  User.findOne({ email: req.body.email }).populate('animal')
  .then(data => {
    console.log(data)
    if (data && bcrypt.compareSync(req.body.password, data.password)) { //bcrypt.compareSync sert à comparer le mdp crypté avec celui rentré en dur lors de la connexion
      res.json({ result: true, user: data });
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
  
      {nom: req.body.nom, prenom: req.body.prenom, pseudo: req.body.pseudo, adresse: req.body.adresse, photo: req.body.photo}
   
    )
    .then(() => {
      res.json({result : true})

      });
  });



router.post('/userimage/upload', async (req,res) => {
  console.log("backou", req.files.photoFromFront)
 
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  
  
  if(!resultMove) {
    console.log("envoi à cloudy")
  const resultCloudinary = await cloudinary.uploader.upload(photoPath);
  fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url});      
  } else {
    res.json({ result: false, error: resultCopy });
  }

 });

 router.post('/animalimage/upload', async (req,res) => {
  console.log("animou", req.files.photoFromFront)
 
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  
  
  if(!resultMove) {
    console.log("envoi à cloudy")
  const resultCloudinary = await cloudinary.uploader.upload(photoPath);
  fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url});      
  } else {
    res.json({ result: false, error: resultCopy });
  }

 });
 
 

 





    



module.exports = router;
