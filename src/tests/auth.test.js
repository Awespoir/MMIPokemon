process.env.JWT_SECRET = "supersecretkey";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("🔑 Authentification API", () => {

  test("Register un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "ash", password: "pikachu123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("ash");
    expect(res.body.password).toBeUndefined();
  });

  test("Login avec credentials corrects", async () => {
    const hashed = await bcrypt.hash("pikachu123", 10);
    await User.create({ username: "ash", password: hashed });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "ash", password: "pikachu123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login avec mauvais mot de passe", async () => {
    const hashed = await bcrypt.hash("pikachu123", 10);
    await User.create({ username: "ash", password: hashed });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "ash", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  test("Route protégée sans token", async () => {
    const res = await request(app)
      .get("/api/pkmn")
      .query({ name: "Pikachu" });

    expect(res.statusCode).toBe(401);
  });

  test("Route protégée avec token", async () => {
    const hashed = await bcrypt.hash("pikachu123", 10);
    await User.create({ username: "ash", password: hashed });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: "ash", password: "pikachu123" });

    const token = login.body.token;

    const res = await request(app)
      .get("/api/pkmn")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "Pikachu" });

    expect([200, 404]).toContain(res.statusCode);
  });

});