// src/tests/pokemon.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const Pokemon = require("../models/pokemon.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

let mongoServer;
let adminToken;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const hashed = await bcrypt.hash("123456", 10);

  // Création d'utilisateurs admin et user
  await User.create({ username: "admin", password: hashed, role: "ADMIN" });
  await User.create({ username: "user", password: hashed, role: "USER" });

  const resAdmin = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "123456" });

  const resUser = await request(app)
    .post("/api/auth/login")
    .send({ username: "user", password: "123456" });

  adminToken = resAdmin.body.token;
  userToken = resUser.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Pokemon.deleteMany({});
});

describe("📦 Pokémon API", () => {
  test("Créer un Pokémon (USER)", async () => {
    const res = await request(app)
      .post("/api/pkmn")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Pikachu",
        imgUrl: "http://img.pikachu.png",
        types: ["ELECTRIC"],
        description: "Mouse Pokémon"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Pikachu");
  });

  test("Récupérer un Pokémon par nom", async () => {
    await Pokemon.create({ name: "Bulbasaur", imgUrl: "http://img.bulba.png", types: ["GRASS"] });

    const res = await request(app)
      .get("/api/pkmn")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ name: "Bulbasaur" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Bulbasaur");
  });

  test("Recherche Pokémon par type et partialName", async () => {
    await Pokemon.insertMany([
      { name: "Pidgey", imgUrl: "http://img.pidgey.png", types: ["FLYING"] },
      { name: "Zapdos", imgUrl: "http://img.zapdos.png", types: ["ELECTRIC","FLYING"] },
      { name: "Electabuzz", imgUrl: "http://img.electabuzz.png", types: ["ELECTRIC"] }
    ]);

    const res = await request(app)
      .get("/api/pkmn/search")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ typeOne: "FLYING", partialName: "Zap" });

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toBe("Zapdos");
  });

  test("Modifier un Pokémon (ADMIN)", async () => {
    const pkmn = await Pokemon.create({ name: "Eevee", imgUrl: "http://img.eevee.png", types: ["NORMAL"] });

    const res = await request(app)
      .put("/api/pkmn")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ id: pkmn._id.toString() })
      .send({ description: "Evolving Pokémon" });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Evolving Pokémon");
  });

  test("Supprimer un Pokémon (ADMIN)", async () => {
    const pkmn = await Pokemon.create({ name: "Squirtle", imgUrl: "http://img.squirtle.png", types: ["WATER"] });

    const res = await request(app)
      .delete("/api/pkmn")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ id: pkmn._id.toString() });

    expect(res.statusCode).toBe(204);
  });

  test("Ajouter et supprimer une région (USER/ADMIN)", async () => {
    const pkmn = await Pokemon.create({ name: "Charmander", imgUrl: "http://img.charm.png", types: ["FIRE"] });

    // Ajouter région
    const resAdd = await request(app)
      .post("/api/pkmn/region")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ pkmnId: pkmn._id.toString(), regionName: "Kanto", regionPokedexNumber: 4 });

    expect(resAdd.statusCode).toBe(200);
    expect(resAdd.body.regions[0].regionName).toBe("Kanto");

    // Supprimer région
    const resRemove = await request(app)
      .delete("/api/pkmn/region")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ pkmnId: pkmn._id.toString(), regionName: "Kanto" });

    expect(resRemove.statusCode).toBe(204);

    const updated = await Pokemon.findById(pkmn._id);
    expect(updated.regions.length).toBe(0);
  });
});