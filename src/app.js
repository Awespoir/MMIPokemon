const express = require('express');
const app = express();
const mainRouter = require('./routes');

app.use(express.json());

// /api préfixé une seule fois
app.use('/api', mainRouter);

module.exports = app;