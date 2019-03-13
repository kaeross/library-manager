const express = require('express')
const path = require('path')
const sequelize = require('./models').sequelize
const bodyParser = require('body-parser')

// Get router files 
const routes = require('./routes/index')
const books = require('./routes/book')

// Create app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// Set routes
app.use('/', routes)
app.use('/books', books)

// Sync database then listen on port 3000
sequelize.sync().then(() => {
    app.listen(3000)
});
