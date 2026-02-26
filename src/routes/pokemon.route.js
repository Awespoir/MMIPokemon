const router = require("express").Router();
const controller = require("../controllers/pokemon.controller");
const pkmnTypeController = require('../controllers/pkmnType.controller');
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { importAllPokemon } = require("../services/pokemon.service");


router.get('/types', pkmnTypeController.getTypes);


// Création
router.post("/", auth, controller.create);

// Recherche
router.get("/search", auth, controller.search);

// Récupérer un Pokémon unique
router.get("/", auth, controller.getOne);

// Modification (ADMIN)
router.put("/", auth, role.hasRole("ADMIN"), controller.update);

// Suppression (ADMIN)
router.delete("/", auth,  controller.delete);

// Gestion des régions
router.post("/region", auth, controller.addRegion);
router.delete("/region", auth, role.hasRole("ADMIN"), controller.removeRegion);

router.post("/import-all", auth, role.hasRole("ADMIN"), async (req, res) => {
  try {
    const result = await importAllPokemon();
    res.json({ message: `Import terminé : ${result.imported} Pokémon ajoutés` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

