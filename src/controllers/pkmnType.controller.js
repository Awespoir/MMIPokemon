const typeService = require("../services/pkmnType.service");

exports.getTypes = (req, res) => {
  const types = typeService.getAllTypes();

  res.json({
    data: types,
    count: types.length
  });
};