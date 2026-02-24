const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

// Controller qui gère la récupération des types
const pkmnTypeController = require('../controllers/pkmnType.controller');

// GET /api/pkmn/types
router.get('/types', pkmnTypeController.getTypes);

// Exemple : création Pokémon réservée aux ADMIN
router.post('/', auth, roleMiddleware('ADMIN'), (req, res) => {
  // Récupérer le nom envoyé dans la requête
  const { name } = req.body;

  // Retourner le message dynamique
  res.status(200).json({ message: `Pokémon ${name} créé !` });
});

// Exemple : lecture Pokémon accessible aux USER et ADMIN
router.get(
  '/',
  auth,
  roleMiddleware(['USER', 'ADMIN']),
  (req, res) => {
    res.json({ data: ['Pikachu', 'Bulbasaur'] });
  }
);

module.exports = router;