const Pokemon = require("../models/pokemon.model");
const axios = require("axios");

// --- Fonctions du service ---
const create = async (data) => {
  return await Pokemon.create(data);
};

const findOne = async ({ id, name }) => {
  if (id) return await Pokemon.findById(id);
  if (name) return await Pokemon.findOne({ name });
  return null;
};

const search = async ({ typeOne, typeTwo, partialName, page = 1, size = 10 }) => {
  const query = {};
  if (typeOne || typeTwo) {
    query.types = { $in: [typeOne, typeTwo].filter(Boolean) };
  }
  if (partialName) query.name = { $regex: partialName, $options: "i" };

  const skip = (page - 1) * size;
  const data = await Pokemon.find(query).skip(skip).limit(size);
  const count = await Pokemon.countDocuments(query);

  return { data, count };
};

const updatePokemon = async (id, data) => {
  return await Pokemon.findByIdAndUpdate(id, data, { new: true });
};

const deletePokemon = async (id) => {
  return await Pokemon.findByIdAndDelete(id);
};

const addRegion = async (pkmnId, regionName, regionPokedexNumber) => {
  const pokemon = await Pokemon.findById(pkmnId);
  if (!pokemon) throw new Error("Pokémon not found");

  const regionIndex = pokemon.regions.findIndex(r => r.regionName === regionName);
  if (regionIndex !== -1) {
    pokemon.regions[regionIndex].regionPokedexNumber = regionPokedexNumber;
  } else {
    pokemon.regions.push({ regionName, regionPokedexNumber });
  }

  await pokemon.save();
  return pokemon;
};

const removeRegion = async (pkmnId, regionName) => {
  const pokemon = await Pokemon.findById(pkmnId);
  if (!pokemon) throw new Error("Pokémon not found");

  pokemon.regions = pokemon.regions.filter(r => r.regionName !== regionName);
  await pokemon.save();
};

// --- Import massif depuis PokeAPI ---
const POKEAPI_BASE = "https://pokeapi.co/api/v2/pokemon";
const TOTAL_POKEMON = 1200; // nombre max de Pokémon
const BATCH_SIZE = 50;

const importAllPokemon = async () => {
  console.log("🔄 Début de l'import Pokémon");
  const listRes = await axios.get(`${POKEAPI_BASE}?limit=${TOTAL_POKEMON}`);
  const allPokemon = listRes.data.results;
  const existingNames = (await Pokemon.find({}, { name: 1 })).map(p => p.name);

  for (let i = 0; i < allPokemon.length; i += BATCH_SIZE) {
    const batch = allPokemon.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async p => {
      if (existingNames.includes(p.name)) return null;
      const details = await axios.get(p.url);
      const data = details.data;
      const imgUrl =
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default ||
        "https://via.placeholder.com/256?text=No+Image";
      return {
        name: data.name,
        imgUrl,
        description: `#${data.id} ${data.name}`,
        types: data.types.map(t => t.type.name),
        regions: []
      };
    });

    const formatted = (await Promise.all(promises)).filter(Boolean);
    if (formatted.length > 0) await Pokemon.insertMany(formatted);
  }

  console.log("🎉 Import Pokémon terminé !");
};

// --- Export final ---
module.exports = {
  create,
  findOne,
  search,
  updatePokemon,
  deletePokemon,
  addRegion,
  removeRegion,
  importAllPokemon
};