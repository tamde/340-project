module.exports = function(){



var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('./dbcon.js');

// displaying all games
function getGames(res, mysql, context, complete){
  mysql.pool.query("SELECT gameId, gameName, genreName, platformName FROM ((Games INNER JOIN Genres ON Games.genreId = Genres.genreId)INNER JOIN Platforms ON Games.platformId = Platforms.platformId);", function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      return;
    }
    context.Games = results;
    complete();
  });
}

// getting drop d
function getGenres(res, mysql, context, complete){
  mysql.pool.query("SELECT genreId as id, genreName FROM Genres", function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.Genres = results;
      complete();
  });
}

function getPlatforms(res, mysql, context, complete){
  mysql.pool.query("SELECT platformId as id, platformName FROM Platforms", function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.Platforms = results;
      complete();
  });
}

// for updating
function getSingleGame(res, mysql, context, id, complete){
  var sql = "SELECT gameId, gameName, genreId, platformId FROM Games WHERE gameId = ?";
  var inserts = [id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.Games = results[0];
      complete();
  });
}


// filtering
function getGamesByName(req, res, mysql, context, complete){
  // let gameName = document.getElementById(gameName).value;
  var query = "SELECT gameId, gameName, genreId, platformId FROM Games WHERE gameName LIKE " + mysql.pool.escape(req.params.s + '%');
  // console.log(query);
  mysql.pool.query(query, function(error, results, fields){
    console.log(query);
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
  context.jsscripts = ["searchGame.js", "deleteGame.js"];
  var mysql = req.app.get('mysql');
  getGames(res, mysql, context, complete);
  getGenres(res, mysql, context, complete);
  getPlatforms(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 3){
      res.render("games", context);
    }
  }
});


// filtering
router.get("/search/:s", function(req, res){
  var callbackCount = 0;
  var context = {};
  context.jsscripts = ["searchGame.js", "deleteGame.js"];
  var mysql = req.app.get('mysql');
  getGamesByName(req, res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render("games", context);
    }
  }
})


  /* Display one person for the specific purpose of updating people */

  router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateGame.js"];
    var mysql = req.app.get('mysql');
    getSingleGame(res, mysql, context, req.params.id, complete);
    getGenres(res, mysql, context, complete);
    getPlatforms(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 3){
            res.render('update-game', context);
        }

    }
});



// inserting game
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

// updating
router.put('/:id', function(req, res){
  var mysql = req.app.get('mysql');
  console.log(req.body)
  console.log(req.params.id)
  var sql = "UPDATE Games SET gameName=?, genreId=?, platformId=? WHERE gameId=?";
  var inserts = [req.body.gameName, req.body.genreId, req.body.platformId, req.params.id];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(error)
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.status(200);
          res.end();
      }
  });
});

//
router.delete('/:id', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM Games WHERE gameId = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          console.log(error)
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
      }else{
          res.status(202).end();
      }
  })
})
return router;
}();
// module.exports = router;