const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/pokedex')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));

