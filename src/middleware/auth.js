import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'authTokens.token': token });

    if (!user) {
      throw new Error('User not Authenticated');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Not Authenticated' });
  }
}

export { auth };