const express = require('express')
const path = require('path')

var routes = require('./routes/index')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes)


// Listen on port 3000
app.listen(3000)