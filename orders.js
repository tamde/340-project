module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //helper function to display orders 
    function getOrders(res, mysql, context, complete){
      mysql.pool.query("SELECT orderId, concat(firstName,' ',lastName) AS fullname, gameName FROM ((Orders INNER JOIN Customers ON Orders.custId = Customers.custId) INNER JOIN Games ON Orders.gameId = Games.gameId);", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
          return;
        }
        context.Orders = results;
        complete();
      });
    }

    //helper function used to format a dropdown customer input menu
    function getCustomers(res, mysql, context, complete){
      mysql.pool.query("SELECT custId as id, firstName, lastName FROM Customers", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.Customers= results;
          complete();
      });
    }

    //helper function used to format a dropdown games input menu
    function getGames(res, mysql, context, complete){
      mysql.pool.query("SELECT gameId as id, gameName FROM Games", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.Games= results;
          complete();
      });
    }

    //route that handles main orders page and input menus
    router.get("/", function(req, res){
      var callbackCount = 0;
      var context = {};    
      var mysql = req.app.get('mysql');
      getOrders(res, mysql, context, complete);
      getCustomers(res, mysql, context, complete);
      getGames(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 3){
          res.render("orders", context);
        }
      }
    });

    //route that handles inserting into the orders table
    router.post('/', function(req, res){
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO Orders (custId, gameId) VALUES (?,?)";
      var inserts = [req.body.customer, req.body.game];
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
    
    return router;
}();

