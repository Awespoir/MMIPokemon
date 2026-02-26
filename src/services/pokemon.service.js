const Pokemon = require("../models/pokemon.model");

// Créer un Pokémon
exports.create = async (data) => {
  return await Pokemon.create(data);
};

// Récupérer un Pokémon par ID ou nom
exports.findOne = async ({ id, name }) => {
  if (id) return await Pokemon.findById(id);
  if (name) return await Pokemon.findOne({ name });
  return null;
};

// Rechercher des Pokémons avec filtres et pagination
exports.search = async ({ typeOne, typeTwo, partialName, page = 1, size = 10 }) => {
  const query = {};

  if (typeOne || typeTwo) {
    query.types = { $in: [typeOne, typeTwo].filter(Boolean) };
  }

  if (partialName) {
    query.name = { $regex: partialName, $options: "i" };
  }

  const skip = (page - 1) * size;
  const data = await Pokemon.find(query).skip(skip).limit(size);
  const count = await Pokemon.countDocuments(query);

  return { data, count };
};

// Modifier un Pokémon
exports.update = async (id, data) => {
  return await Pokemon.findByIdAndUpdate(id, data, { new: true });
};

// Supprimer un Pokémon
exports.delete = async (id) => {
  return await Pokemon.findByIdAndDelete(id);
};

// Ajouter une région à un Pokémon
exports.addRegion = async (pkmnId, regionName, regionPokedexNumber) => {
  const pokemon = await Pokemon.findById(pkmnId);
  if (!pokemon) throw new Error("Pokémon not found");

  const regionIndex = pokemon.regions.findIndex(r => r.regionName === regionName);

  if (regionIndex !== -1) {
    // Mise à jour du numéro si la région existe
    pokemon.regions[regionIndex].regionPokedexNumber = regionPokedexNumber;
  } else {
    pokemon.regions.push({ regionName, regionPokedexNumber });
  }

  await pokemon.save();
  return pokemon;
};

// Supprimer une région d’un Pokémon
exports.removeRegion = async (pkmnId, regionName) => {
  const pokemon = await Pokemon.findById(pkmnId);
  if (!pokemon) throw new Error("Pokémon not found");

  pokemon.regions = pokemon.regions.filter(r => r.regionName !== regionName);

  await pokemon.save();
  return;
};