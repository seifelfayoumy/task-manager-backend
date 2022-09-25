import * as dotenv from 'dotenv';
import express from "express";
import { userRouter } from "./routers/userRouter.js";
import { taskRouter } from './routers/taskRouter.js';
import "./db/mongoose.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(userRouter);
app.use(taskRouter);


const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});