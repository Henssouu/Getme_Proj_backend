var express = require('express');
var router = express.Router();
const User = require("../models/users");
const Animal = require("../models/animals");
const WantedNotice = require("../models/wantedNotice");
const { checkBody } = require("../modules/checkBody");
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');


/* GET users listing. */
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      // Create a new user object with the 'wantedNotice' property set as an empty array
      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        wantedNotice: [], // Set the wantedNotice property as an empty array initially
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // The user already exists in the database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).populate('messages').populate('wantedNotice')
    .then(data => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, user: data });
      } else {
        res.json({ result: false, error: 'User not found or wrong password' });
      }
    });
});

router.get('/:token', async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });

    if (user) {
      const wantedNotice = user.wantedNotice || [];

      res.json({ ...user._doc, wantedNotice });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.json({ result: false, error: 'Error fetching user data' });
  }
});

router.post('/:token', (req, res) => {
  if (!checkBody(req.body, ['nom', 'prenom', 'pseudo'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { nom, prenom, pseudo, adresse, latitude, longitude } = req.body;

  User.updateOne(
    { token: req.params.token },
    { nom, prenom, pseudo, adresse, latitude, longitude }
  )
    .then((data) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: 'User not found or no changes made' });
      }
    })
    .catch((error) => {
      console.error('Error updating user:', error);
      res.status(500).json({ result: false, error: 'Internal server error' });
    });
});

router.get('/messages/:token', async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });

    if (user) {
      // Corrected the URL to fetch messages using the user._id
      fetch(`http://${process.env.EXPO_PUBLIC_IP_STRING}:3000/api/messages/get-messages/${user._id}`)
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => res.json({ result: true, messages: data.messages })) // Send the messages to the client
        .catch((error) => {
          console.error('Error fetching messages:', error);
          res.json({ result: false, error: 'An error occurred while fetching messages.' });
        });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.json({ result: false, error: 'Error fetching user data' });
  }
});

module.exports = router;
