const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  regionName: { type: String, required: true },
  regionPokedexNumber: { type: Number, required: true }
});

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imgUrl: { type: String, required: true },
  description: { type: String },
  types: {
    type: [String],
    validate: v => v.length >= 1 && v.length <= 2
  },
  regions: [regionSchema]
});

module.exports = mongoose.model("Pokemon", pokemonSchema);