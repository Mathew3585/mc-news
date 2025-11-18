const jwt = require('jsonwebtoken')

// Secret pour JWT (à changer dans .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'changez-moi-en-production-svp'

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}

// Générer un token JWT
const generateToken = (username) => {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '7d' } // Token valide 7 jours
  )
}

module.exports = { verifyToken, generateToken, JWT_SECRET }
