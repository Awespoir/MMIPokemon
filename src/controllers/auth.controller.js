// src/controllers/auth.controller.js
process.env.JWT_SECRET = "testsecret";
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer.model");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Champs requis" });

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Utilisateur existe déjà" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Création user
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "USER"
    });

    // ✅ Création trainer automatique
    await Trainer.create({
      username: user.username,
      trainerName: user.username,
      imgUrl: "",
      pkmnSeen: [],
      pkmnCatch: []
    });

    // ✅ On retire le password de la réponse
    const userResponse = {
      _id: user._id,
      username: user.username,
      role: user.role
    };

    res.status(201).json(userResponse);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

exports.checkUser = async (req, res) => {
  res.status(200).json({
    message: "User is authenticated",
    user: req.user
  });
};