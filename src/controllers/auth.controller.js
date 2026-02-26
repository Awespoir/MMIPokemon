// src/controllers/auth.controller.js
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: "USER" });

    // Ne pas renvoyer le mot de passe
    const { password: _pwd, ...userWithoutPassword } = user.toObject();

    res.status(201).json(userWithoutPassword);
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

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

exports.checkUser = async (req, res) => {
  res.status(200).json({
    message: "User is authenticated",
    user: req.user
  });
};