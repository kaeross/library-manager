const express = require('express')
const path = require('path')

// Get router files 
const routes = require('./routes/index')
const books = require('./routes/book')

// Create app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Give app accesss to public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set routes
app.use('/', routes)
app.use('/books', books)


// Listen on port 3000
app.listen(3000)