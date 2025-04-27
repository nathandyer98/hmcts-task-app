import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

import Task from "../src/models/task.model.js";
import { task1Fixture, task2Fixture, task3Fixture, task4Fixture } from "./fixtures/tasks.fixtures.js";

import { createApiTestAgent } from './utils/apiTestAgent.js';


let mongoServer;
let apiTestAgent;
let task1Object, task2Object, task3Object, task4Object;

const createTask = async (task) => {
    const newTask = new Task(task);
    await newTask.save();
    const taskObject = newTask.toObject();
    return taskObject;
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Memory Server started at ${mongoUri}`);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
});

beforeEach(async () => {
    await Task.deleteMany({});

    try {
        apiTestAgent = createApiTestAgent();
    } catch (error) {
        console.error('Error setting up agent users in beforeEach:', error);
        throw error;
    }
});

//Test suit for retrieving all tasks
describe('GET /api/tasks', () => {
    it('should retrieve all tasks', async () => {
        await createTask(task1Fixture);
        await createTask(task2Fixture);
        await createTask(task3Fixture);
        await createTask(task4Fixture);


        const response = await apiTestAgent.get('/api/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);
    });

    it('should return an empty array if no tasks exist', async () => {
        const response = await apiTestAgent.get('/api/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

//Test suit for retrieving a single task
describe('GET /api/tasks/:id', () => {
    it('should retrieve a single task', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.get(`/api/tasks/${task1Object._id}`);
        expect(response.status).toBe(200);
        const task = response.body;
        expect(task._id.toString()).toEqual(task1Object._id.toString());
        expect(task.title).toEqual(task1Object.title);
        expect(task.description).toEqual(task1Object.description);
        expect(task.dueDate).toEqual(task1Object.dueDate.toISOString());
        expect(task.status).toEqual(task1Object.status);
    });

    it('should return 404 if task is not found', async () => {
        const response = await apiTestAgent.get(`/api/tasks/${new mongoose.Types.ObjectId().toString()}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Task not found.');
    });
});

//Test suit for creating a new task
describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
        const response = await apiTestAgent.post('/api/tasks').send(task1Fixture);
        expect(response.status).toBe(201);
        task1Object = response.body;
        expect(task1Object.title).toEqual(task1Fixture.title);
        expect(task1Object.description).toEqual(task1Fixture.description);
        expect(task1Object.dueDate).toEqual(task1Fixture.dueDate.toISOString());
        expect(task1Object.status).toEqual(task1Fixture.status);

        const dbTask = await Task.findById(task1Object._id);
        expect(dbTask.title).toEqual(task1Object.title);
        expect(dbTask.description).toEqual(task1Object.description);
        expect(dbTask.dueDate.toISOString()).toEqual(task1Object.dueDate);
        expect(dbTask.status).toEqual(task1Object.status);
    });

    it('should return 400 if title is missing', async () => {
        const response = await apiTestAgent.post('/api/tasks').send({ description: 'Test Task', dueDate: '2023-01-01' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Title is required');
    });
});

//Test suit for updating a task
describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.put(`/api/tasks/${task1Object._id}`).send(task2Fixture);
        expect(response.status).toBe(200);
        const updatedTask = response.body;
        expect(updatedTask.title).toEqual(task2Fixture.title);
        expect(updatedTask.description).toEqual(task2Fixture.description);
        expect(updatedTask.dueDate).toEqual(task2Fixture.dueDate.toISOString());
        expect(updatedTask.status).toEqual(task2Fixture.status);
    });

    it('should return 404 if task is not found', async () => {
        const response = await apiTestAgent.put(`/api/tasks/${new mongoose.Types.ObjectId().toString()}`).send(task2Fixture);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Task not found.');
    });


    it('should return 401 if title is invalid data', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.put(`/api/tasks/${task1Object._id}`).send({ title: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "Invalid data: If provided, 'title' must be a non-empty string.");
    });

    it('should return 400 if description is invalid data', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.put(`/api/tasks/${task1Object._id}`).send({ description: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "Invalid data: If provided and not null, 'description' must be a non-empty string.");
    });

    it('should return 400 if dueDate is invalid data', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.put(`/api/tasks/${task1Object._id}`).send({ dueDate: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "Invalid data: If provided, 'dueDate' must be a valid date representation or null.");
    });

    it('should return 400 if status is invalid data', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.put(`/api/tasks/${task1Object._id}`).send({ taskStatus: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "Invalid data: If provided, 'status' must be one of the allowed values (e.g., To Do, In Progress, Completed).");
    });
});

//Test suit for deleting a task
describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
        task1Object = await createTask(task1Fixture);
        const response = await apiTestAgent.delete(`/api/tasks/${task1Object._id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('Task deleted successfully.');

        const deletedTask = await Task.findById(task1Object._id);
        expect(deletedTask).toBeNull();
    });

    it('should return 404 if task is not found', async () => {
        const response = await apiTestAgent.delete(`/api/tasks/${new mongoose.Types.ObjectId().toString()}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Task not found.');

    });
});