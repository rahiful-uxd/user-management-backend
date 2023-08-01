const request = require('supertest');
// const express = require('express');
const app = require('../../app');

describe('GET /showalluser', () => {
    it('should return all users', async () => {
        const response = await request(app).get('/showalluser');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('All Users showed successfully');
        expect(response.body.result).toEqual([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
      });
});