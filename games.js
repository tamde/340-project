var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

function getGames(res, mysql, context, complete){
  mysql.pool.query("SELECT * FROM Games", function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      return;
    }
    context.Games = results;
    complete();
  });
}



function getGamesByName(req, res, mysql, context, complete){
  // let gameName = document.getElementById(gameName).value;
  var query = "SELECT gameId, gameName, genreId, platformId FROM Games WHERE Games.genreName LIKE " + mysql.pool.escape(req.params.s + '%');
  console.log(query);
  mysql.pool.query(query, function(error, results, fields){
    if(error){
        res.write(JSON.stringify(error));
        res.end();
    }
    context.Games = results;
    complete();
});
}

router.get("/", function(req, res){
  var callbackCount = 0;
  var context = {};
  
  var mysql = req.app.get('mysql');
  getGames(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render("games", context);
    }
  }
});

router.get("/search/:s", function(req, res){
  var callbackCount = 0;
  var context = {};
  context.jssscripts = ["searchGames.js"];
  var mysql = req.app.get('mysql');
  getGamesByName(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render("games", context);
    }
  }
})

router.post('/', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Games (gameName, genreId, platformId) VALUES (?,?,?)";
  var inserts = [req.body.gameName, req.body.genreId, req.body.platformId];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/games');
      }
  });
});


module.exports = router;