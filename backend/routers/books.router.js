const express = require("express");
const { Book } = require("../models/Book");
const { checkToken } = require("../middleware/auth");
const multer = require("multer");
// in routes/stuff.js

const booksCtrl = require('../controllers/books');

const { storage } = require("../middleware/storage");

const bookRouter = express.Router();

bookRouter.post("/:id/rating", checkToken, postRating);
bookRouter.get("/", getBooks);
bookRouter.get("/bestrating", getBooksWithBestRating);
bookRouter.get("/:id", getBook);

bookRouter.delete("/:id", checkToken, deleteBook);

bookRouter.post("/", checkToken, multer({ storage: storage }).single("image"), postBooks);

bookRouter.put("/:id", checkToken, putBook);
module.exports = { bookRouter };

async function postRating(req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  const userId = req.body.userIdFromToken;
  try {
    const ratings = book.ratings;
    if (ratings.some((obj) => obj.userId === userId)) {
      return res.status(400).send("You have already rated this book");
    }
    const newRating = {
      userId: userId,
      grade: req.body.rating
    };
    ratings.push(newRating);

    const sum = ratings.reduce((total, curr) => (total += curr.grade), 0);
    const numberOfRaters = ratings.length;
    const averageRating = sum / numberOfRaters;
    book.ratings = ratings;
    book.averageRating = averageRating;

    book.save();
    res.send(book);
  } catch (error) {
    console.error(error);
  }
}

async function getBooksWithBestRating(req, res) {
  const books = await Book.find().sort({ averageRating: -1 }).limit(3);
  res.send(books);
}

async function putBook(req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  if (!book) return res.status(404).send("Book not found");
  const userId = book.userId;
  if (userId !== req.body.userIdFromToken)
    return res.status(401).send("You can only update your own books");
  const result = await Book.findOneAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      genre: req.body.genre
    }
  );
  res.send(result);
}

async function deleteBook(req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  if (!book) return res.status(404).send("Book not found");
  const userIdOnBook = book.userId;
  if (userIdOnBook !== req.body.userIdFromToken)
    return res.status(401).send("You can only delete your own books");
  const result = await Book.findByIdAndDelete(id);
  res.send(result);
}


function postBooks(req, res) {
  const bookStringified = req.body.book;
  const book = JSON.parse(bookStringified);
  const file = req.file;
  try {
    const newBook = new Book({
      userId: book.userId,
      title: book.title,
      author: book.author,
      imageUrl: file.filename,
      year: book.year,
      genre: book.genre,
      ratings: [
        {
          userId: book.userId,
          grade: book.ratings.find((obj) => obj.userId === book.userId).grade
        }
      ],
      averageRating: 0
    });
    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
  }
}


// infos livre
async function getBooks(req, res) {
  const Books = await Book.find();
  Books.forEach((book) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/${book.imageUrl}`;
    book.imageUrl = imageUrl;
  });
  res.send(Books);
}

function generateUrl(localUrl) {
  const hostUrl = process.env.HOST_URL;
  const port = process.env.PORT;
  const absoluteUrl = localUrl;
  return absoluteUrl;
  
}

// infos détail livre
async function getBook(req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  book.imageUrl = `${req.protocol}://${req.get('host')}/${book.imageUrl}`;
  res.send(book);
}