//pour valider les jetons JWT et protéger les routes.
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Route protégée
router.get("/", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Bienvenue dans tes conversations !",
    userId: req.userId
  });
});

module.exports = router;
