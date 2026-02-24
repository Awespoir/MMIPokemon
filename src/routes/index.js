const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const pkmnRoutes = require('./pokemon.route');

router.use('/auth', authRoutes);
router.use('/pkmn', pkmnRoutes);

module.exports = router;