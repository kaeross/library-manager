var express = require('express');
var router = express.Router();

/* Redirect to homepage */
router.get('/', function(req, res, next) {
  res.redirect("/books")
  .catch(err => 
    res.render('errors/page_not_found', {
      pageTitle: '404 error'
    })
  )
});


module.exports = router;