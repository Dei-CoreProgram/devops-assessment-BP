const request = require('supertest');
const app = require('./index');
const jwt = require('jsonwebtoken');

const API_KEY = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const JWT_SECRET = 'your-secret-key-change-in-production';

describe('POST /DevOps', () => {
  const generateValidJWT = () => {
    return jwt.sign({ sub: 'test' }, JWT_SECRET);
  };

  test('Valid request should return success message', async () => {
    const response = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .set('X-JWT-KWY', generateValidJWT())
      .send({
        message: 'This is a test',
        to: 'Juan Perez',
        from: 'Rita Asturia',
        timeToLifeSec: 45
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Hello Juan Perez your message will be send'
    });
  });

  test('Invalid API Key should return error', async () => {
    const response = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', 'invalid-key')
      .set('X-JWT-KWY', generateValidJWT())
      .send({
        message: 'This is a test',
        to: 'Juan Perez',
        from: 'Rita Asturia',
        timeToLifeSec: 45
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('ERROR');
  });

  test('Missing JWT should return error', async () => {
    const response = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .send({
        message: 'This is a test',
        to: 'Juan Perez',
        from: 'Rita Asturia',
        timeToLifeSec: 45
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('ERROR');
  });

  test('Missing "to" field should return error', async () => {
    const response = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .set('X-JWT-KWY', generateValidJWT())
      .send({
        message: 'This is a test',
        from: 'Rita Asturia',
        timeToLifeSec: 45
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'ERROR' });
  });

  test('GET method should return ERROR', async () => {
    const response = await request(app)
      .get('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .set('X-JWT-KWY', generateValidJWT());

    expect(response.status).toBe(200);
    expect(response.text).toBe('ERROR');
  });

  test('PUT method should return ERROR', async () => {
    const response = await request(app)
      .put('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .set('X-JWT-KWY', generateValidJWT())
      .send({ message: 'test' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('ERROR');
  });

  test('DELETE method should return ERROR', async () => {
    const response = await request(app)
      .delete('/DevOps')
      .set('X-Parse-REST-API-Key', API_KEY)
      .set('X-JWT-KWY', generateValidJWT());

    expect(response.status).toBe(200);
    expect(response.text).toBe('ERROR');
  });
});

describe('GET /health', () => {
  test('Health check should return status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });
});
