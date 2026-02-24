const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/pokedex_test');
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  const userData = { username: 'ash', password: 'pikachu' };

  test('POST /api/auth/register', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Utilisateur créé');
  });

  test('POST /api/auth/login', async () => {
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app).post('/api/auth/login').send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/checkUser', async () => {
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app).post('/api/auth/checkUser').send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('login fail with wrong password', async () => {
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app).post('/api/auth/login').send({ username: 'ash', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});