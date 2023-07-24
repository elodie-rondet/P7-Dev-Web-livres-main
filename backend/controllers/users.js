
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.signupUser  = async function (req, res)  {
    const userVerif = await User.findOne({ email: req.body.email });
    if (userVerif == null) {
    const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          email: req.body.email,
          password: hash
        });
        await user.save()
      .then(() => res.send({ userId: user._id }));
    }
    else {
        res.status(401).send({ message: "Expected email to be unique" });
    }
  };
  
  exports.logUser = async function (req, res) {
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

  function makeToken(user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    return token;
  }
