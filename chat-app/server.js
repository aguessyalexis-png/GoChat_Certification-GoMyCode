require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.urlencoded({ extended: true })); // express.urlencoded récupère les données des formulaires HTML
app.use(express.json()); //app.use enrégistre les routes tandisque express.json récupère les données JSON
const cors = require("cors");

// Autoriser React à communiquer avec Express
app.use(cors({
  origin: "http://localhost:3000"
}));

// Routes d'authentification
app.use("/api/auth", require("./routes/auth"));

// Connexion à la base de données
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Base de données connectée avec succès");

    // Lancement du serveur
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur lors de la connexion à la base :", err);
    process.exit(1);
  });
