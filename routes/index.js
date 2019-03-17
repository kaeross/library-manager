var express = require('express');
var router = express.Router();

/* Redirect to homepage */
router.get('/', function(req, res, next) {
  res.redirect("/books")
});


module.exports = router;