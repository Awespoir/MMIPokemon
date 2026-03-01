const Trainer = require("../models/trainer.model");
const Pokemon = require("../models/pokemon.model");

class TrainerService {
  // Récupérer le trainer sans le créer automatiquement
  async findTrainer(username) {
    if (!username) throw new Error("Username requis");
    return await Trainer.findOne({ username });
  }

  // Récupérer le trainer, le créer si inexistant (uniquement pour get)
  async getTrainer(username) {
    let trainer = await this.findTrainer(username);
    if (!trainer) {
      trainer = await Trainer.create({
        username,
        trainerName: username, // par défaut le même que username
        imgUrl: "",
        pkmnSeen: [],
        pkmnCatch: []
      });
    }
    return trainer;
  }

  // Créer un trainer explicitement
  async createTrainer(username, trainerName, imgUrl = "") {
    let trainer = await this.findTrainer(username);
    if (trainer) return trainer;

    trainer = await Trainer.create({
      username,
      trainerName: trainerName || username,
      imgUrl,
      pkmnSeen: [],
      pkmnCatch: []
    });

    return trainer;
  }

  async updateTrainer(username, updateData) {
    const trainer = await this.getTrainer(username);
    Object.assign(trainer, updateData);
    await trainer.save();
    return trainer;
  }

  // Suppression sécurisée : ne recrée pas automatiquement
  async deleteTrainer(username) {
    const trainer = await this.findTrainer(username);
    if (!trainer) return null;

    await Trainer.deleteOne({ username });
    return trainer; // renvoie l'ancien trainer
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