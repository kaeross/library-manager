var express = require('express');
var router = express.Router();
var Book = require('../models').Book
const sequelize = require('../models').sequelize
const Op = sequelize.Op

/**
 * Function to handle 500 server error
 * @param {Object} response 
 * @param {Object} error 
 */
const serverError = (response, error) => {
  console.error(error)
  response.render('errors/error', {
    pageTitle: '500 error'
  })
}

/* GET home page - Shows the full list of books */
router.get('/', function(req, res, next) {

  // If there is no query string default to page 1
  let nextPage = req.query.page ? req.query.page : 1

  // Show all if page is view all
  if (nextPage === 'viewAll') {
    Book.findAll().then( books => {
      return res.render("books/index", {
        pageTitle: 'Books',
        books: books,
        page: nextPage
      })
    }).catch(err => serverError(res, err))
  } else {
    // Get number of books
    Book.findAll({
      offset: (nextPage -1) * 10,
      limit: 10,
      order: [["createdAt", "DESC"]]
    }).then( books => {
      // If there are less than 10 books returned this is the final page      
      return res.render("books/index", {
        pageTitle: 'Books',
        books: books,
        page: nextPage,
        finalPage: books.length < 10
      })
    }).catch(err => serverError(res, err))
  }
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
  Book.create(req.body).then(book => res.redirect("/books/book_detail/" + book.id))
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


/**
 * Handles the search functionality
 */
router.post('/search', function(req, res, next) {
  const category = req.body.category
  const searchVal = req.body.search
  let searchObj = {}

  searchObj[category] = {
    [Op.like] : '%' + req.body.search + '%'
  }

  Book.findAll({
    where: searchObj
  }).then( books => {
    return res.render("books/index", {
      pageTitle: 'Search results for: ' + req.body.search,
      books: books,
      hideSearch: true
    })
  }).catch(err => console.log(err))
})

/* GET book details page. */
router.get('/book_detail/:id', function(req, res, next) {
    // Retrieve book from database by id
    Book.findByPk(req.params.id)
    .then( book => {
      // Pass in book data to pug template
      res.render("books/update-book", {
        pageTitle: book.title,
        book: book
      })
    })
    .catch(err => serverError(res, err))
});

/**
 * Handles the POST request to update a book. 
 * */
router.post('/book_detail/:id', function(req, res, next) {
  Book.findByPk(req.params.id)
  .then( book => {
    // update book and if successful redirect to homepage
    book.update(req.body).then( () => res.redirect("/books"))
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
  })
  .catch(err => serverError(res, err))
})

/**
 * Handles the POST request to delete a book. 
 * */
router.post('/book_detail/:id/delete', function(req, res, next) {
  Book.findByPk(req.params.id)
  .then( book => book.destroy())
  .then( () => res.redirect('/') )
  .catch(err => serverError(res, err))
})


module.exports = router