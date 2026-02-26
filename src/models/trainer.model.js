const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // lien vers user
  trainerName: { type: String, required: true },
  imgUrl: { type: String },
  creationDate: { type: Date, default: Date.now },
  pkmnSeen: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
  pkmnCatch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }]
});

module.exports = mongoose.model("Trainer", TrainerSchema);