const pkmnTypeService = require('../services/pkmnType.service');

const getTypes = (req, res) => {
  const types = pkmnTypeService.getAllTypes();

  res.status(200).json({
    data: types,
    count: types.length
  });
};

module.exports = {
  getTypes
};