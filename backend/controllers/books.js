const { Book } = require("../models/Book");
const multer = require("multer");
const { storage } = require("../middleware/storage");
    

  exports.upload = multer({ storage: storage }).single("image");
  exports.getBooksWithBestRating = async function (req, res) {
  const books =  await Book.find().sort({ averageRating: -1 }).limit(3);
  for (let i = 0; i < books.count; ++i) {
    const imageUrl = `${req.protocol}://${req.get('host')}/${books[i].imageUrl}`;
    books[i].imageUrl = imageUrl;
  };
  res.send(books);
}


exports.putBook = async function (req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  const result = await Book.findOneAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      genre: req.body.genre,
      imageUrl: `${req.protocol}://${req.get('host')}/${req.file.filename}`,
      ratings: [
        {
          userId: req.body.userId,
          grade: book.ratings != null ? book.ratings.find((id) => id.userId === book.userId).grade : null
        }
      ],
      averageRating: calculateAverageRating(book.ratings)
    }
  );
  console.log(result);
  res.send(result);
}



exports.postRating = async function (req, res) {
  const id = req.params.id;
  if (id == null || id == "undefined") {
    res.status(400).send("Book id is missing");
    return;
  }
  const rating = req.body.rating;
  try {
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Book not found");
      return;
    }
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
      averageRating: calculateAverageRating(book.ratings)
    });
    const ratingsInDb = book.ratings;
    const previousRatingFromCurrentUser = ratingsInDb.find((rating) => rating.userId == id);
    if (previousRatingFromCurrentUser != null) {
      res.status(400).send("You have already rated this book");
      return;
    }
    const newRating = { id: userId, grade: rating };
    ratingsInDb.push(newRating);
    book.averageRating = calculateAverageRating(ratingsInDb);
    await book.save();
    res.send(newRating);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong:" + e.message);
  }
}

exports.getBestRating = async function (req, res) {
  try {
    const booksWithBestRatings = await Book.find().sort({ rating: -1 }).limit(3);
    booksWithBestRatings.forEach((book) => {
      book.imageUrl = `${req.protocol}://${req.get('host')}/${book.imageUrl}`;
    });
    res.send(booksWithBestRatings);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong:" + e.message);
  }
}

function calculateAverageRating(ratings) {
  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  return sumOfAllGrades / ratings.length;
}




exports.deleteBook = async function (req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  if (!book) return res.status(404).send("Livre non trouvé");
  const result = await Book.findByIdAndDelete(id);
  res.send(result);
}


  exports.getBook= async function (req, res) {
  const id = req.params.id;
  const book = await Book.findById(id);
  book.imageUrl = `${req.protocol}://${req.get('host')}/${book.imageUrl}`;
  res.send(book);
}


  exports.postBooks  = function (req, res) {
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
      averageRating: calculateAverageRating(book.ratings)
    });
    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
  }
}




  exports.getBooks = async function (req, res) {
  const allBooks =  await Book.find();
  
    for (let i = 0; i < allBooks.count; ++i) {
    const imageUrl = `${req.protocol}://${req.get('host')}/${allBooks[i].imageUrl}`;
    allBooks[i].imageUrl = imageUrl;
    }
  res.send(allBooks);

}
