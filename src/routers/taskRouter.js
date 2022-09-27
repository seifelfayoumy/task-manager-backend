import express from 'express';
import { Task } from '../models/task.js';
import { auth } from '../middleware/auth.js';
import { authorizeTaskAction } from '../middleware/authorizeTaskAction.js';

const taskRouter = express.Router();

taskRouter.post('/tasks', auth, async (req, res) => {
  const user = req.user;
  const task = new Task({ ...req.body, owner: user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

taskRouter.post('/tasks/update', auth, authorizeTaskAction, async (req, res) => {
  const changes = Object.keys(req.body);
  const validChanges = ['title', 'description', 'isCompleted', '_id'];
  const isValid = changes.every((change) => validChanges.includes(change));

  if (!isValid) {
    return res.status(400).send('invalid changes')
  }

  try {
    changes.forEach((update) => req.task[update] = req.body[update]);
    await req.task.save();
    res.status(200).send(req.task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.post('/tasks/delete', auth, authorizeTaskAction, async (req, res) => {
  const taskId = req.task._id;
  try {
    await Task.deleteOne({ _id: taskId });
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

export { taskRouter };