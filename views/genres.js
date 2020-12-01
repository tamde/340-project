var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

function getGenres(res, mysql, context, complete){
    mysql.pool.query("SELECT * FROM Genres", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
        return;
      }
      context.Genres = results;
      complete();
    });
  }


router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Genres (genreName) VALUES (?)";
    var inserts = [req.body.genreName];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/genres');
        }
    });
  });


router.get("/", function(req, res){
var callbackCount = 0;
var context = {};

var mysql = req.app.get('mysql');
getGenres(res, mysql, context, complete);
function complete(){
    callbackCount++;
    if(callbackCount >= 1){
    res.render("genres", context);
    }
}
});
module.exports = router;