import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export { Task };