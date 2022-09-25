import { Task } from "../models/task.js";

const authorizeTaskAction = async (req, res, next) => {
  try {
    const user = req.user;
    const taskId = req.body._id;

    const isOwner = await Task.isUserOwner(user, taskId);

    if (!isOwner) {
      throw new Error();
    }

    const task = await Task.findById(taskId);
    req.task = task;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Not Authorized' });
  }
}

export { authorizeTaskAction };