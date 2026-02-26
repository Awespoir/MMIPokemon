const trainerService = require("../services/trainer.service");

// Créer un trainer ou récupérer l'existant
exports.createTrainer = async (req, res) => {
  try {
    const { trainerName, imgUrl } = req.body;

    const trainer = await trainerService.createTrainer(
      req.user.username,
      trainerName,
      imgUrl
    );

    const status = trainerName && trainerName !== trainer.trainerName ? 200 : 201;
    res.status(status).json(trainer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Récupérer le trainer de l'utilisateur
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.getTrainer(req.user.username);
    if (!trainer) return res.status(404).json({ message: "Trainer non trouvé" });

    res.status(200).json(trainer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.updateTrainer(req.user.username, req.body);
    res.status(200).json(trainer);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: err.message });
  }
};

// Supprimer le trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.deleteTrainer(req.user.username);
    if (!trainer) return res.status(404).json({ message: "Trainer non trouvé" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Marquer un Pokémon
exports.markPokemon = async (req, res) => {
  try {
    const { pkmnId, isCaptured } = req.body;
    if (!pkmnId || typeof isCaptured !== "boolean")
      return res.status(400).json({ message: "pkmnId et isCaptured requis" });

    const trainer = await trainerService.markPokemon(req.user.username, pkmnId, isCaptured);
    if (!trainer) return res.status(404).json({ message: "Pokémon non trouvé" });

    res.status(200).json(trainer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};