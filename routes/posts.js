var express = require('express');
var router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const { checkBody } = require('../modules/checkBody');


router.post('/', (req, res) => {
    if (!checkBody(req.body, ['token', 'content'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    User.findOne({ token: req.body.token }).then(user => {
      if (user === null) {
        res.json({ result: false, error: 'User not found' });
        return;
      }
  
      const newPost = new Post({
        author: user._id,
        content: req.body.content,
        createdAt: new Date(),
      });
  
      newPost.save().then(newDoc => {
        res.json({ result: true, content: newDoc });
      });
    });
  });
  
  router.get('/all/:token', (req, res) => {
    User.findOne({ token: req.params.token }).then(user => {
      if (user === null) {
        res.json({ result: false, error: 'User not found' });
        return;
      }
 
      Post.find() 
        .populate('author', ['nom', 'prenom', 'pseudo', 'photo'])
        .populate('likes', ['pseudo'])
        .sort({ createdAt: 'desc' })
        .then(data => {
          console.log('essaie',data)
          res.json({ result: true, data });
        });
    });
  });

  router.put('/like', (req, res) => {
    if (!checkBody(req.body, ['token', 'postId'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    User.findOne({ token: req.body.token }).then(user => {
      if (user === null) {
        res.json({ result: false, error: 'Post not found' });
        return;
      }
  
      Post.findById(req.body.postId).then(post => {
        if (!post) {
          res.json({ result: false, error: 'Post not found' });
          return;
        }
  
        if (post.likes.includes(user._id)) { // Si l'utilisateur aime déjà le post
          Post.updateOne({ _id: post._id }, { $pull: { likes: user._id } }) // Supprime des likes l'ID de l'utilisateur 
            .then(() => {
              res.json({ result: true });
            });
        } else { // L'utilisateur n'a pas encore aimé le post
          Post.updateOne({ _id: post._id }, { $push: { likes: user._id } }) // Ajoute aux likes l'ID de l'utilisateur
            .then(() => {
              res.json({ result: true });
            });
        }
      });
    });
  });
  
  router.delete('/', (req, res) => {
    if (!checkBody(req.body, ['token', 'postId'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    User.findOne({ token: req.body.token }).then(user => {
      if (user === null) {
        res.json({ result: false, error: 'User not found' });
        return;
      }
  
      Post.findById(req.body.postId)
        .populate('author')
        .then(post => {
          if (!post) {
            res.json({ result: false, error: 'Post not found' });
            return;
          } else if (String(post.author._id) !== String(user._id)) { // On transforme les ObjectID en String car JS ne peux pas comparer deux objets.
            res.json({ result: false, error: 'Post can only be deleted by its author' });
            return;
          }
  
          Post.deleteOne({ _id: post._id }).then(() => {
            res.json({ result: true });
          });
        });
    });
  });



module.exports = router;
