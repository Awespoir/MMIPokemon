const Trainer = require("../models/trainer.model");

// Récupérer un trainer par username
exports.getTrainer = async (username) => {
  if (!username) throw new Error("Username requis");
  return Trainer.findOne({ username });
};

// Créer un nouveau trainer
exports.createTrainer = async (username, trainerName, imgUrl) => {
  if (!username || !trainerName) throw new Error("Username et trainerName requis");

  const existing = await Trainer.findOne({ username });
  if (existing) return existing; // si déjà existant, retourne l’existant

  const trainer = new Trainer({
    username,
    trainerName,
    imgUrl,
    pkmnSeen: [],
    pkmnCatch: [],
  });

  return trainer.save();
};

// Mettre à jour un trainer
exports.updateTrainer = async (username, data) => {
  if (!username) throw new Error("Username requis");

  return Trainer.findOneAndUpdate(
    { username },
    { $set: data },
    { new: true, runValidators: true } // renvoie l'objet mis à jour
  );
};

// Supprimer un trainer
exports.deleteTrainer = async (username) => {
  if (!username) throw new Error("Username requis");

  return Trainer.findOneAndDelete({ username });
};

// Marquer un Pokémon comme vu ou capturé
exports.markPokemon = async (username, pkmnId, isCaptured) => {
  if (!username) throw new Error("Username requis");
  if (!pkmnId) throw new Error("pkmnId requis");

  const trainer = await Trainer.findOne({ username });
  if (!trainer) return null;

  if (isCaptured) {
    if (!trainer.pkmnCatch.includes(pkmnId)) trainer.pkmnCatch.push(pkmnId);
  } else {
    if (!trainer.pkmnSeen.includes(pkmnId)) trainer.pkmnSeen.push(pkmnId);
  }

  return trainer.save();
};