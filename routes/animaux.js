var express = require('express');
var router = express.Router();
const Animal = require("../models/animals");
const User = require("../models/users")
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
                description: req.body.description,     
              });
              newAnimal.save().then((data) => {
                // Récupérez l'ID de l'animal nouvellement créé
                const animalId = data._id;
                console.log('id animal', animalId)


                // Récupérer le token de la collection user
                 const userToken = req.body.token;
                 console.log('token', userToken)

                 // Mettre à jour le modèle User avec l'ID de l'animal nouvellement créé
                 
                 User.updateOne(
                    { token: userToken },
                    { $push: {animal: animalId } },
                 ).then(data => { console.log("apres update", data)})
                res.json({ result: true, animal: data });
                // User.updateOne(
                //     {token: req.params.token},
                  
                //       {animal: data.animal}
                   
                //     )
            
                
                      });
              });
              
           
         

module.exports = router;
