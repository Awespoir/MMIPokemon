const express = require('express');
const app = express();
const mainRouter = require('./routes');
 const cors = require("cors");


app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

// /api préfixé une seule fois
app.use('/api', mainRouter);

module.exports = app;