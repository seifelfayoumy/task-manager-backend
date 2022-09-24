import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error('invalid email');
      }
    },
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(password) {
      if (!validator.isStrongPassword(password)) {
        throw new Error('invalid password');
      }
    },
  },
  authTokens: [{
    token: {
      type: String,
      required: true
    }
  }],
}, {
  timestamps: true
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.authTokens = user.authTokens.concat({ token });
  await user.save();
  return token;
}

userSchema.methods.simplify = async function() {
  const user = this;

  const userObject = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }

  console.log(userObject)
  return userObject;
}

userSchema.statics.findByEmailAndPass = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    throw new Error('incorrect password');
  }

  return user;
}

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

const User = mongoose.model('User', userSchema);

export { User };