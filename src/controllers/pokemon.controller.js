const service = require("../services/pokemon.service");

// ---------------------- Création ----------------------
exports.create = async (req, res) => {
  try {
    const pokemon = await service.create(req.body);
    res.status(201).json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Récupérer un Pokémon unique ----------------------
exports.getOne = async (req, res) => {
  try {
    const pokemon = await service.findOne({ id: req.query.id, name: req.query.name });
    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });
    res.json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Rechercher des Pokémon ----------------------
exports.search = async (req, res) => {
  try {
    const { typeOne, typeTwo, partialName, page = 1, size = 10 } = req.query;
    const result = await service.search({
      typeOne,
      typeTwo,
      partialName,
      page: parseInt(page),
      size: parseInt(size),
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Modifier un Pokémon (ADMIN) ----------------------
exports.update = async (req, res) => {
  try {
    const updated = await service.updatePokemon(req.query.id, req.body);
    if (!updated) return res.status(404).json({ message: "Pokémon not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Supprimer un Pokémon (ADMIN) ----------------------
exports.delete = async (req, res) => {
  try {
    await service.deletePokemon(req.query.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Ajouter une région ----------------------
exports.addRegion = async (req, res) => {
  try {
    const { pkmnId, regionName, regionPokedexNumber } = req.body;
    const pokemon = await service.addRegion(pkmnId, regionName, regionPokedexNumber);
    res.json(pokemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Supprimer une région (ADMIN) ----------------------
exports.removeRegion = async (req, res) => {
  try {
    const { pkmnId, regionName } = req.query;
    await service.removeRegion(pkmnId, regionName);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------------- Importer tous les Pokémon depuis PokeAPI ----------------------
exports.importAll = async (req, res) => {
  try {
    await service.importAllPokemon();
    res.status(200).json({ message: "Import Pokémon terminé !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};