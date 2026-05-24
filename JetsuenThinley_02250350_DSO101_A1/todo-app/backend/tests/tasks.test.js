jest.mock('../db', () => ({
  query: jest.fn()
}));

const request = require('supertest');
const app = require('../index');
const pool = require('../db');

describe('Tasks API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /tasks - should return all tasks', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, title: 'Buy groceries', completed: false },
        { id: 2, title: 'Do laundry', completed: true }
      ]
    });

    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /tasks - should create a new task', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 3, title: 'Test task', completed: false }]
    });

    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test task');
  });

  test('POST /tasks - should reject empty title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Task title cannot be empty');
  });

  test('PUT /tasks/:id - should update a task', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Updated task', completed: true }]
    });

    const res = await request(app)
      .put('/tasks/1')
      .send({ title: 'Updated task', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated task');
  });

  test('PUT /tasks/:id - should return 404 if task not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/tasks/999')
      .send({ title: 'Ghost task', completed: false });

    expect(res.statusCode).toBe(404);
  });

  test('DELETE /tasks/:id - should delete a task', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Buy groceries', completed: false }]
    });

    const res = await request(app).delete('/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  test('DELETE /tasks/:id - should return 404 if not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/tasks/999');
    expect(res.statusCode).toBe(404);
  });

});