var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

function getOrders(res, mysql, context, complete){
  mysql.pool.query("SELECT * FROM Orders", function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      return;
    }
    context.Orders = results;
    complete();
  });
}



// function getGamesByName(res, mysql, context, complete){
//   // let gameName = document.getElementById(gameName).value;
//   var query = "SELECT gameId, gameName, genreId, platformId FROM Games WHERE Games.genreName LIKE " + mysql.pool.escape(req.params.s + '%');
//   mysql.pool.query(query, function(error, results, fields){
//     if(error){
//         res.write(JSON.stringify(error));
//         res.end();
//     }
//     context.Games = results;
//     console.log(context.Games);
//     complete();
// });
// }

router.get("/", function(req, res){
  var callbackCount = 0;
  var context = {};
  
  var mysql = req.app.get('mysql');
  getOrders(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render("orders", context);
    }
  }
});

// router.get("/search/:s", function(req, res){
//   var callbackCount = 0;
//   var context = {};
//   var mysql = req.app.get('mysql');
//   getGamesByName(res, mysql, context, complete);
//   function complete(){
//     callbackCount++;
//     if(callbackCount >= 1){
//       res.render("games", context);
//     }
//   }
// })

router.post('/', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Orders (custId, gameId) VALUES (?,?)";
  var inserts = [req.body.custId, req.body.gameId];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/orders');
      }
  });
});


module.exports = router;