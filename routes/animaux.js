var express = require('express');
var router = express.Router();
const Animal = require("../models/animals");
const {checkBody} = require("../modules/checkBody");

/* GET home page. */
router.post('/newanimal', (req,res) => {
        if (!checkBody(req.body, ['nom','type', 'taille', 'couleur', 'poil', 'sex', 'castré', 'tatouage', 'puce'])) {
          res.json({ result: false, error: 'Missing or empty fields' });
          return;
        }
      
              const newAnimal = new Animal({
                nom: req.body.nom,
                type: req.body.type,
                taille: req.body.taille,
                birthday: req.body.birthday,
                couleur: req.body.couleur,
                poil: req.body.poil,
                sex: req.body.sex,
                castré: req.body.castré,
                tatouage: req.body.tatouage,
                puce: req.body.puce,
                description: req.body.puce,     
              });
              newAnimal.save().then(() => {
                res.json({ result: true});
              });
           
            });


module.exports = router;
