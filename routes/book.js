var express = require('express');
var router = express.Router();
var Book = require('../models').Book

/* GET home page - Shows the full list of books */
router.get('/', function(req, res, next) {
  // Get all books in database
  Book.findAll({order: [["createdAt", "DESC"]]})
  .then( books => {
    res.render("books/all_books", {
      pageTitle: 'Books',
      books: books
    })
  })
  .catch(err => {
      res.render('errors/error', {
          pageTitle: '500 error',
          error: err
      })
  })
});

/* GET new book page. */
router.get('/new', function(req, res, next) {
    res.render("books/new_book", {book: Book.build(), pageTitle: "New book"})
//     .catch(err => {
//     if(err.name === "SequelizeValidationError") {
//         res.render("books/new_book", {
//             book: Book.build(req.body),
//             pageTitle: "New Book",
//             errors: err
//         })
//     } else {
//       throw err
//     }
//   }).catch(err => {
//         res.render('errors/error', {
//             pageTitle: '500 error',
//             error: err
//         })
//     })
});

/* POST add new book. */
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(book => {
    res.redirect("/books/" + book.id);
  })
});

/* GET book details page. */
router.get('/:id', function(req, res, next) {
    // Retrieve book from database by id
    Book.findByPk(req.params.id)
    .then( book => {
      // Pass in book data to pug template
        res.render("books/book_detail", {
          pageTitle: book.title,
          book: book,
          title: book.title, 
          author: book.author, 
          genre: book.genre, 
          year: book.year
        })
    })
});

module.exports = router;