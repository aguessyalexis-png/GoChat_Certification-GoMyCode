//Vérifie le JWT et identifie l'utilisateur
const jwt = require("jsonwebtoken");

// Vérification du token JWT
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentification requise."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Jeton invalide ou expiré."
    });
  }
};

module.exports = authMiddleware;
