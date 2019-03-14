var express = require('express');
var router = express.Router();
var Book = require('../models').Book

/**
 * Function to handle 500 server error
 * @param {Object} response 
 * @param {Object} error 
 */
const serverError = (response, error) => {
  console.log(error)
  response.render('errors/error', {
    pageTitle: '500 error'
  })
}

const notFound = (response) => {
  response.render('errors/page_not_found', {
    pageTitle: '404 error'
  })
}

/* GET home page - Shows the full list of books */
router.get('/', function(req, res, next) {
  // Get all books in database
  Book.findAll({order: [["createdAt", "DESC"]]})
  .then( books => {
    return res.render("books/index", {
      pageTitle: 'Books',
      books: books
    })
  })
  .catch(err => serverError(res, err))
});

/** 
 * Handles the GET request for the new book page. 
 * Passes the book object and page title to the template
 * */
router.get('/new', function(req, res, next) {
  return res.render("books/new-book", {
    book: Book.build(), 
    pageTitle: "New book"
  })
})

/**
 * Handles the POST request to add a new book. 
 * */
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(book => res.redirect("/books/" + book.id))
  .catch(err => {
    // If there is a validation error pass the errors to the template
    if(err.name === "SequelizeValidationError") {
      res.render("books/new-book", {
        book: Book.build(req.body),
        pageTitle: "New Book",
        errors: err.errors
      })
    } else {
      throw err
    }
  }).catch(err => serverError(res, err))
})

/* GET book details page. */
router.get('/:id', function(req, res, next) {
    // Retrieve book from database by id
    Book.findByPk(req.params.id)
    .then( book => {
      if (book) {
        // Pass in book data to pug template
        res.render("books/update-book", {
          pageTitle: book.title,
          book: book
        })
      } else {
        notFound(res)
      }
    })
    .catch(err => serverError(res, err))
});

/**
 * Handles the POST request to update a book. 
 * */
router.post('/:id', function(req, res, next) {
  Book.findByPk(req.params.id)
  .then( book => {
    if (book) { // check book hasn't suddenly disappeared anywhere
     // update book and if successful redirect to homepage
      book.update(req.body).then( () => res.redirect("/books/"))
      .catch(err => {
        // If there is a validation error pass the errors to the template and don't redirect
        if(err.name === "SequelizeValidationError") {
          res.render("books/update-book", {
            book: book,
            pageTitle: "Update Book",
            errors: err.errors
          })
        } else {
          throw err
        }
      })
    } else {
      notFound(res)
    }
  })
  .catch(err => serverError(res, err))
})

/**
 * Handles the POST request to delete a book. 
 * */
router.post('/:id/delete', function(req, res, next) {
  Book.findByPk(req.params.id)
  .then( book => book.destroy())
  .then( () => res.redirect('/') )
  .catch(err => serverError(res, err))
})

module.exports = router;