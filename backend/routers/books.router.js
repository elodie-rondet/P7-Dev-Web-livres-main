const express = require("express");
const { Book } = require("../models/Book");
const { checkToken } = require("../middleware/auth");
const multer = require("multer");
const books = require('../controllers/books');

const { storage } = require("../middleware/storage");

const bookRouter = express.Router();

bookRouter.post("/:id/rating", checkToken, books.postRating);
bookRouter.get("/", books.getBooks);
bookRouter.get("/bestrating", books.getBooksWithBestRating);
bookRouter.get("/:id", books.getBook);
bookRouter.get("/bestrating", books.getBestRating);

bookRouter.delete("/:id", checkToken, books.deleteBook);

bookRouter.post("/", checkToken, multer({ storage: storage }).single("image"), books.postBooks);

bookRouter.put("/:id", checkToken, multer({ storage: storage }).single("image"), books.putBook);

module.exports = { bookRouter };


