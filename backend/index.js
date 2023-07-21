const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const mongoUrl = `mongodb+srv://elodierondet2:bMqG6y7b80SKYjmy@cluster0.lvpdn4f.mongodb.net/`;
const { userRouter } = require("./routers/users.router");
const { bookRouter } = require("./routers/books.router");
const path = require('path');
const multer = require('multer');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("image"));

// Routers
app.use("/api/auth", userRouter);
app.use("/api/books", bookRouter);

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


 

  async function connect() {
    try {
      await mongoose.connect(mongoUrl);
      console.log("Connected to mongodb");
    } catch (e) {
      console.error("Error connecting to mongodb");
      console.error(e);
    }
  }

  
  connect();
module.exports = app;
