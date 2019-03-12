var express = require('express');
var router = express.Router();
var Book = require('../models').Book

/* GET home page. */
router.get('/', function(req, res, next) {
  // Get all books in database
  Book.findAll({order: [["createdAt", "DESC"]]})
  .then( books => {
    res.render("books/all_books", {
      pageTitle: 'Books',
      books: books
    })
  })
});

/* GET book details page. */
router.get('/book/:id', function(req, res, next) {
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

/* GET new book page. */
router.get('/new', function(req, res, next) {
  res.render("books/new_book", {
    pageTitle: 'New Book'
  })
});

/* POST add new book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(book => {
    res.redirect("/book/" + book.id);
  }).catch(err => {
    if(err.name === "SequelizeValidationError") {
      res.render("books/book_detail", {
        pageTitle: book.title,
        book: book,
        title: book.title, 
        author: book.author, 
        genre: book.genre, 
        year: book.year
      })
    } else {
      throw err
    }
  }).catch( err => res.send(500))
});

module.exports = router;