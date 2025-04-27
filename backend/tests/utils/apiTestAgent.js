import request from 'supertest';
import { app } from '../../src/server.js';


/**
 * Creates a super test agent
 * @returns {request.SuperTest<request.Test>} - A Supertest agent instance without session cookie.
 */
export const createApiTestAgent = () => request.agent(app);

