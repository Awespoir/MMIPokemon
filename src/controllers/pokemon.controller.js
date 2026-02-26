const service = require("../services/pokemon.service");

// Créer un Pokémon
exports.create = async (req, res) => {
  try {
    const pokemon = await service.create(req.body);
    res.status(201).json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer un Pokémon par ID ou nom
exports.getOne = async (req, res) => {
  try {
    const pokemon = await service.findOne({ id: req.query.id, name: req.query.name });
    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });
    res.json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Rechercher des Pokémons
exports.search = async (req, res) => {
  try {
    const { typeOne, typeTwo, partialName, page = 1, size = 10 } = req.query;
    const result = await service.search({ typeOne, typeTwo, partialName, page: parseInt(page), size: parseInt(size) });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier un Pokémon (ADMIN)
exports.update = async (req, res) => {
  try {
    const updated = await service.update(req.query.id, req.body);
    if (!updated) return res.status(404).json({ message: "Pokémon not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un Pokémon (ADMIN)
exports.delete = async (req, res) => {
  try {
    await service.delete(req.query.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ajouter une région à un Pokémon
exports.addRegion = async (req, res) => {
  try {
    const { pkmnID, regionName, regionPokedexNumber } = req.body;
    const pokemon = await service.addRegion(pkmnID, regionName, regionPokedexNumber);
    res.json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une région d’un Pokémon (ADMIN)
exports.removeRegion = async (req, res) => {
  try {
    const { pkmnID, regionName } = req.query;
    await service.removeRegion(pkmnID, regionName);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};