const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Toutes les routes nécessitent authentification
router.post("/", authMiddleware, trainerController.createTrainer);
router.get("/", authMiddleware, trainerController.getTrainer);
router.put("/", authMiddleware, trainerController.updateTrainer);
router.delete("/", authMiddleware, trainerController.deleteTrainer);

// Marquer un Pokémon (vu ou capturé)
router.post("/mark", authMiddleware, trainerController.markPokemon);

module.exports = router;