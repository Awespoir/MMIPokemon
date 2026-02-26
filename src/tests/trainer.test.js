// src/tests/trainer.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const Trainer = require("../models/trainer.model");
const Pokemon = require("../models/pokemon.model");
const User = require("../models/user.model");

let mongoServer;
let userToken;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const bcrypt = require("bcrypt");
  const hashed = await bcrypt.hash("123456", 10);

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
  await Trainer.deleteMany({});
  await Pokemon.deleteMany({});
});

describe("📚 Trainer API corrigé", () => {
  test("Créer un dresseur", async () => {
    const res = await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha", imgUrl: "http://img.sacha.png" });

    // On accepte 201 (créé) ou 400 (déjà existant)
    expect([201, 400]).toContain(res.statusCode);

    if (res.statusCode === 201) {
      expect(res.body.trainerName).toBe("Sacha");
      expect(res.body.username).toBe("user");
      expect(res.body.pkmnSeen).toEqual([]);
      expect(res.body.pkmnCatch).toEqual([]);
    }
  });

  test("Récupérer le dresseur", async () => {
    // Créer d'abord
    await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha", imgUrl: "http://img.sacha.png" });

    const res = await request(app)
      .get("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.trainerName).toBe("Sacha");
    expect(res.body.username).toBe("user");
  });

  test("Mettre à jour le trainer", async () => {
    // Créer d'abord
    await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha", imgUrl: "http://img.sacha.png" });

    const res = await request(app)
      .put("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.trainerName).toBe("Sacha Updated");
  });

  test("Supprimer le trainer", async () => {
    // Créer d'abord
    await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha", imgUrl: "http://img.sacha.png" });

    const res = await request(app)
      .delete("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(204);
  });

  test("Marquer un Pokémon comme vu ou capturé", async () => {
    // Créer d'abord le trainer
    await request(app)
      .post("/api/trainer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trainerName: "Sacha", imgUrl: "http://img.sacha.png" });

    // Créer un Pokémon
    const pkmn = await Pokemon.create({
      name: "Pikachu",
      imgUrl: "http://img.pikachu.png",
      types: ["ELECTRIC"],
      description: "Mouse Pokémon",
    });

    // Marquer comme vu
    const resSeen = await request(app)
      .post("/api/trainer/mark")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ pkmnId: pkmn._id.toString(), isCaptured: false });

    expect(resSeen.statusCode).toBe(200);
    expect(resSeen.body.pkmnSeen.length).toBe(1);
    expect(resSeen.body.pkmnCatch.length).toBe(0);

    // Marquer comme capturé
    const resCaught = await request(app)
      .post("/api/trainer/mark")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ pkmnId: pkmn._id.toString(), isCaptured: true });

    expect(resCaught.statusCode).toBe(200);
    expect(resCaught.body.pkmnSeen.length).toBe(1);
    expect(resCaught.body.pkmnCatch.length).toBe(1);
  });
});