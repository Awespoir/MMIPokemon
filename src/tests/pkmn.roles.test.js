const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

// Crée un token JWT factice
const createToken = (role) => {
  return jwt.sign(
    { id: '123456', role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
};

describe('Pokémon routes with JWT + roles', () => {

  test('ADMIN can create Pokémon', async () => {
    const token = createToken('ADMIN');
    const res = await request(app)
      .post('/api/pkmn/')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Charmander' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Pokémon Charmander créé !');
  });

  test('USER cannot create Pokémon', async () => {
    const token = createToken('USER');
    const res = await request(app)
      .post('/api/pkmn/')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bulbasaur' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Accès interdit');
  });

  test('USER can read Pokémon', async () => {
    const token = createToken('USER');
    const res = await request(app)
      .get('/api/pkmn/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toContain('Pikachu');
  });

  test('ADMIN can read Pokémon', async () => {
    const token = createToken('ADMIN');
    const res = await request(app)
      .get('/api/pkmn/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toContain('Bulbasaur');
  });

  test('Non-authenticated user cannot access Pokémon', async () => {
    const res = await request(app)
      .get('/api/pkmn/');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Non authentifié');
  });
});