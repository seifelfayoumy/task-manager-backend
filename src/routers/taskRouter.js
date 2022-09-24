import express from 'express';
import { Task } from '../models/task.js';
import { auth } from '../middleware/auth.js';

const taskRouter = express.Router();

taskRouter.post('/tasks',auth, async (req,res) => {

});

export { taskRouter };