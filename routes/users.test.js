// Import des modules nécessaires
require('dotenv').config(); // Charger les variables d'environnement depuis un fichier .env
const request = require("supertest"); // Bibliothèque pour effectuer des requêtes HTTP dans les tests
const express = require("express");
const app = express();
const router = require("./users"); // Import du routeur défini pour les utilisateurs
const mongoose = require("mongoose"); // Bibliothèque pour interagir avec la base de données MongoDB
const User = require('../models/users'); // Import du modèle utilisateur

// Récupérer la chaîne de connexion à la base de données depuis les variables d'environnement
const connectionString = process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));

app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use("/", router); // Utilisation du routeur pour les routes commençant par "/"

// Suite de tests pour les routes utilisateur
describe("User Routes", () => {
      // Test : Vérifier si des champs manquent ou sont vides dans la requête
      
      
        it('should return 400 if missing or empty fields', async () => {
          const response = await request(app)
            .post('/signup')
            .send({
                email :"citadium@citadjjjjjjium.com",
              });
            // Vérifications des réponses attendues
    
              expect(response.status).toBe(200);
              expect(response.body.result).toBe(false);
             expect(response.body.error).toBe('Missing or empty fields');

            });
    it('should return gg', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
            email :"citadium@citadium.com",
            password:"a",
          });
        // Vérifications des réponses attendues

          expect(response.status).toBe(200);
          expect(response.body.result).toBe(true);
        });
});
