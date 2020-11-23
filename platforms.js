var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

router.get("/", function(req, res, next){
  res.render("platforms");
});
module.exports = router;