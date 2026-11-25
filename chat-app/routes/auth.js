//Gestion des routes d'authentification (incription,connexion et déconnexion)

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

// Inscription
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatar, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Le nom, l'email et le mot de passe sont obligatoires."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse email existe déjà."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      avatar,
      phone
    });

    return res.status(201).json({
      message: "Compte créé avec succès.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } 
  
  catch (error) {
    console.error("Erreur inscription :", error);
    return res.status(500).json({
      message: "Erreur lors de l'inscription."
    });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Identifiants incorrects."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Identifiants incorrects."
      });
    }

    // Génération du JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } 
  
  catch (error) {
    console.error("Erreur connexion :", error);
    return res.status(500).json({
      message: "Erreur lors de la connexion."
    });
  }
});

module.exports = router;
