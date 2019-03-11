var express = require('express');
var router = express.Router();
var Book = require('../models').Book

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("books/all_books")
});

/* GET book details page. */
router.get('/book_detail/:id', function(req, res, next) {
  Book.findById(req.params.id)
  .then( book => {
      res.render("books/book_detail", {
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
  res.render("books/new_book")
});

/* POST add new book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(book => {
    res.redirect("/book_detail/" + book.id);
  }).catch(err => {
    if(err.name === "SequelizeValidationError") {
      res.render("books/book_detail", {
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