const request = require('supertest');

const BASE_URL = 'http://nginx:8197';
const credentials = Buffer.from('devuser:devpw').toString('base64');

describe('State Manager API Tests', () => {
    test('GET /state should succeed regardless of auth', async () => {
        const response = await request(BASE_URL).get('/state');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('text/plain');
    });

    test('PUT /state without authorization should return 401', async () => {
        const response = await request(BASE_URL).put('/state');
        expect(response.statusCode).toBe(401);
    });

    test('PUT /state with authorization should return 200', async () => {
        const response = await request(BASE_URL)
            .put('/state')
            .set('Authorization', `Basic ${credentials}`)
            .set('Content-Type', 'text/plain')
            .send('RUNNING');
        expect(response.statusCode).toBe(200);
    });

    test('GET /state should return RUNNING after change', async () => {
        const response = await request(BASE_URL).get('/state');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('text/plain');
        expect(response.text).toBe('RUNNING');
    });

    // test('GET /request should return text', async () => {
    //     const response = await request(BASE_URL)
    //         .get('/request')
    //         .set('Authorization', `Basic ${credentials}`);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.type).toBe('text/plain');
    // });

    test('GET /run-log should return text', async () => {
        const response = await request(BASE_URL).get('/run-log');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('text/plain');
    });
});
