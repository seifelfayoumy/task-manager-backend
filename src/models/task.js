import mongoose, { SchemaType } from "mongoose";
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

taskSchema.statics.isUserOwner = async (user, taskId) => {

  const task = await Task.findById(taskId);

  if (!task || !task.owner.equals(user._id)) {
    return false;
  }
  return true;
}

taskSchema.statics.deleteUserTasks = async (userId) => {

  await Task.deleteMany({owner: userId});
}

taskSchema.statics.getTasksForUser = async (userId) => {

  const tasks = await Task.find({owner: userId});
  return tasks;
}

const Task = mongoose.model('Task', taskSchema);

export { Task };