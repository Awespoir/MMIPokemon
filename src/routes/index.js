const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const pkmnRoutes = require('./pokemon.route');
const trainerRoutes = require("./trainer.routes");

router.use('/auth', authRoutes);
router.use('/pkmn', pkmnRoutes);
router.use("/trainer", trainerRoutes);

module.exports = router;