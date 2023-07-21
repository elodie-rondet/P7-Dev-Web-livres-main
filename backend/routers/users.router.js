const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function signupUser (req, res)  {
  const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        email: req.body.email,
        password: hash
      });
      await user.save()
    .then(() => res.send({ userId: user._id }));
};

async function logUser(req, res) {
  const requestBody = req.body;
  if (!requestBody.email || !requestBody.password) {
    res.status(400).send({ message: "Missing email or password" });
    return;
  }
  const user = await User.findOne({ email: requestBody.email });
  if (user == null) {
    res.status(401).send({ message: "Wrong credentials" });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(requestBody.password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).send({ message: "Wrong credentials" });
    return;
  }
  res.send({ userId: user._id, token: makeToken(user) });
}
const userRouter = express.Router();
userRouter.post("/login", logUser);
userRouter.post("/signup", signupUser);

module.exports = { userRouter };

function makeToken(user) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return token;
}
