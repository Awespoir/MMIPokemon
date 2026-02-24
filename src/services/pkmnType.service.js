const PkmnType = require('../models/pkmnType.model');

const getAllTypes = () => {
  return [...PkmnType]; 
};

module.exports = {
  getAllTypes
};