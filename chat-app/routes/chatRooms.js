const express = require("express");
const mongoose = require("mongoose");

const Conversation = require("../Models/Conversation");
const User = require("../Models/User");
const GroupMember = require("../Models/GroupMember");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Création d'un salon de discussion insertion du middleware
router.post("/salons", authMiddleware, async (req, res) => {
  try {
    const { type, groupId, participantId, title } = req.body;

    // Vérification du type de salon
    if (!["direct", "group"].includes(type)) {
      return res.status(400).json({
        message: "Type de salon invalide.",
      });
    }

    let salonData = {
      type,
      createdBy: req.userId,
      title,
    };

    // Création d'un salon de groupe
    if (type === "group") {
      if (!groupId) {
        return res.status(400).json({
          message: "L'identifiant du groupe est obligatoire.",
        });
      }

      const membre = await GroupMember.findOne({
        groupId,
        userId: req.userId,
        status: "active",
      });

      if (!membre) {
        return res.status(403).json({
          message: "Vous n'êtes pas membre de ce groupe.",
        });
      }

      salonData.groupId = groupId;
    }

    // Création d'une conversation privée
    if (type === "direct") {
      if (!participantId) {
        return res.status(400).json({
          message: "Le destinataire est obligatoire.",
        });
      }

      if (participantId === req.userId.toString()) {
        return res.status(400).json({
          message: "Vous ne pouvez pas créer une conversation avec vous-même.",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(participantId)) {
        return res.status(400).json({
          message: "Identifiant du destinataire invalide.",
        });
      }

      //    Bloc permettant d'éviter les doublons
      const participant = await User.findById(participantId);

      if (!participant || !participant.isActive) {
        return res.status(404).json({
          message: "Utilisateur introuvable ou inactif.",
        });
      }

      salonData.participants = [req.userId, participantId];
    }
    const salonExistant = await Conversation.findOne({
      type: "direct",
      participants: {
        $all: [req.userId, participantId],
        $size: 2,
      },
    });

    if (salonExistant) {
      return res.status(200).json({
        message: "Cette conversation existe déjà.",
        salon: salonExistant,
      });
    }
    //Création d'une nouvelle conversation
    const nouveauSalon = await Conversation.create(salonData);

    return res.status(201).json({
      message: "Salon créé avec succès.",
      salon: nouveauSalon,
    });
  } catch (error) {
    console.error("Erreur lors de la création du salon :", error);

    return res.status(500).json({
      message: "Erreur lors de la création du salon.",
    });
  }
});

// Route protégée pour tester l'authentification
router.get("/", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Bienvenue dans tes conversations !",
    userId: req.userId
  });
});

module.exports = router;
