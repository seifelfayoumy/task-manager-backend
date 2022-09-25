import express from 'express';
import { User } from '../models/user.js';
import { auth } from '../middleware/auth.js';
import { Task } from '../models/task.js';

const userRouter = express.Router();

userRouter.post('/users/signup', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByEmailAndPass(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.authTokens = req.user.authTokens.filter((authToken) => {
      return authToken.token !== req.token;
    })
    await req.user.save()

    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.post('/users/logout-all', auth, async (req, res) => {
  try {
    req.user.authTokens = [];
    await req.user.save()

    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.get('/users/user-details', auth, async (req, res) => {
  try {
    const user = await req.user.simplify();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.patch('/users', auth, async (req, res) => {
  const changes = Object.keys(req.body);
  const validChanges = ['firstName', 'lastName', 'email', 'password'];
  const isValid = changes.every((change) => validChanges.includes(change));

  if (!isValid) {
    return res.status(400).send('invalid changes')
  }

  try {
    changes.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.delete('/users', auth, async (req, res) => {
  try {
    await Task.deleteUserTasks(req.user._id);
    await User.deleteOne({ _id: req.user._id });
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

export { userRouter };