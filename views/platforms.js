var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

function getPlatforms(res, mysql, context, complete){
    mysql.pool.query("SELECT * FROM Platforms", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
        return;
      }
      context.Platforms = results;
      complete();
    });
  }


router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Platforms (platformName) VALUES (?)";
    var inserts = [req.body.platformName];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/platforms');
        }
    });
  });


router.get("/", function(req, res){
var callbackCount = 0;
var context = {};

var mysql = req.app.get('mysql');
getPlatforms(res, mysql, context, complete);
function complete(){
    callbackCount++;
    if(callbackCount >= 1){
    res.render("platforms", context);
    }
}
});
module.exports = router;