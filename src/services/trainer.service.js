// src/services/trainer.service.js
const Trainer = require("../models/trainer.model");
const Pokemon = require("../models/pokemon.model");

class TrainerService {
  async getTrainer(username) {
    if (!username) throw new Error("Username requis");

    let trainer = await Trainer.findOne({ username });
    if (!trainer) {
      // Toujours passer username et trainerName
      trainer = await Trainer.create({
        username,
        trainerName: username, // par défaut le même que username
        pkmnSeen: [],
        pkmnCatch: []
      });
    }
    return trainer;
  }

  async updateTrainer(username, updateData) {
    const trainer = await this.getTrainer(username);
    Object.assign(trainer, updateData);
    await trainer.save();
    return trainer;
  }

  async deleteTrainer(username) {
    await Trainer.findOneAndDelete({ username });
  }

  async markPokemon(username, pkmnId, isCaptured) {
    const trainer = await this.getTrainer(username);
    const pkmn = await Pokemon.findById(pkmnId);
    if (!pkmn) return null;

    if (isCaptured) {
      if (!trainer.pkmnCatch.includes(pkmnId)) trainer.pkmnCatch.push(pkmnId);
    } else {
      if (!trainer.pkmnSeen.includes(pkmnId)) trainer.pkmnSeen.push(pkmnId);
    }

    await trainer.save();
    return trainer;
  }
}

module.exports = new TrainerService();