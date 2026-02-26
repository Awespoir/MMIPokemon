const PkmnType = require("../models/pkmnType.model");

exports.getAllTypes = () => {
  return PkmnType;
};