const express = require("express");
const users = require('../controllers/users');
const userRouter = express.Router();
userRouter.post("/login", users.logUser);
userRouter.post("/signup", users.signupUser);

module.exports = { userRouter };


