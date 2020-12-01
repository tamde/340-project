module.exports = function(){
    var express = require('express');
    var router = express.Router();

  function getCustomers(res, mysql, context, complete){
    mysql.pool.query("SELECT * FROM Customers", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
        return;
      }
      context.Customers = results;
      complete();
    });
  }

  function getCustomer(res, mysql, context, id, complete){
          var sql = "SELECT custId as id, firstName, lastName, street, city, state FROM Customers WHERE custId = ?";
          var inserts = [id];
          mysql.pool.query(sql, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.person = results[0];
              complete();
          });
      }

  //Display customers table//
  router.get("/", function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteperson.js"]
    var mysql = req.app.get('mysql');
    getCustomers(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      console.log(req.body);
      console.log(req.body);  
      if(callbackCount >= 1){
        res.render("customers", context);
      }
    }
  });

  //INSERT customer//

  router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Customers (firstName, lastName, street, city, state) VALUES (?,?,?,?,?)";
    var inserts = [req.body.fName, req.body.lName, req.body.street, req.body.city, req.body.state];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/customers');
        }
    });
  });

  router.get('/:id', function(req, res){
          callbackCount = 0;
          var context = {};
          context.jsscripts = ["updateperson.js"];
          var mysql = req.app.get('mysql');
          getCustomer(res, mysql, context, req.params.id, complete);
          function complete(){
              callbackCount++;
              if(callbackCount >= 1){
                  res.render('update-customer', context);
              }

          }
      });

  router.put('/:id', function(req, res){
          var mysql = req.app.get('mysql');
          console.log(req.body) 
          console.log(req.params.id)
          var sql = "UPDATE Customers SET firstName=?, lastName=?, street=?, city=?, state=? WHERE custId=?";
          var inserts = [req.body.fname, req.body.lname, req.body.street, req.body.city, req.body.state, req.params.id];
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

  router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE custId=?";
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