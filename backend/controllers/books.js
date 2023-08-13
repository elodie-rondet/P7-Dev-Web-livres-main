const { Book } = require("../models/Book");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
    

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
          grade: book.ratings.find((id) => id.userId === book.userId) !== undefined ? 
          book.ratings.find((id) => id.userId === book.userId).grade : 0
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
    res.status(400).send("Le livre n'a pas été trouvé");
    return;
  }
  const rating = req.body.rating;

  try {
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Book not found");
      return;
    }

    const previousRatingFromCurrentUser = book.ratings.find((id) => id.userId === req.body.userId);
    console.log(previousRatingFromCurrentUser);
    if (previousRatingFromCurrentUser != null) {
      res.status(400).send("Vous avez déjà noté ce livre");
      return;
    }
    const newRating = { userId:req.body.userId, grade: rating };
    book.ratings.push(newRating);
    console.log(book.ratings)
    if (book.ratings) book.averageRating = calculateAverageRating(book.ratings);
    await book.save();
    res.send(book);
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
  res.send(book);
}


  exports.postBooks  = async function (req, res) {
  const bookStringified = req.body.book;
  const book = JSON.parse(bookStringified);
  const file = req.file;
  let { filename } = file;

  const lastDotIndex = filename.lastIndexOf('.');
  filename = filename.slice(0, lastDotIndex) + '-sharp.webp';
  
const QUALITY_RATIO = 90;
const MAX_WIDTH_PX = 350;
const MAX_HEIGHT_PX = 500;
  
  try {
    const newBook = new Book({
      userId: book.userId,
      title: book.title,
      author: book.author,
      imageUrl: `${req.protocol}://${req.get('host')}/${filename}`,
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
  
      await sharp(file.path)
        .resize(MAX_WIDTH_PX, MAX_HEIGHT_PX, { fit: 'cover' })
        .webp({ quality: QUALITY_RATIO })
        .toFile(path.resolve(file.destination, filename));
      req.file.filename = filename;
    
    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
  }
  finally {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
        console.log(error)
    }
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
