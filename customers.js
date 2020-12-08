module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //gathers all customers to be displayed 
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

	//returns a single customer from table to be updated
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

    //returns customers with a last name starting with a given letter
    function getCustomerWithFirstNameLike(req, res, mysql, context, complete) {
        var query = "SELECT custId, firstName, lastName, street, city, state FROM Customers WHERE firstName LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
              res.write(JSON.stringify(error));
                res.end();
            }
            context.Customers = results;
            complete();
        });
    }


    //returns customers with a last name starting with a given letter
    function getCustomerWithLastNameLike(req, res, mysql, context, complete) {
        var query = "SELECT custId, firstName, lastName, street, city, state FROM Customers WHERE lastName LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
              res.write(JSON.stringify(error));
                res.end();
            }
            context.Customers = results;
            complete();
        });
    }

    //route that handles first name customer searches
    router.get('/firstnamesearch/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","searchcustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomerWithFirstNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });

    //route that handles last name customer searches
    router.get('/lastnamesearch/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","searchcustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomerWithLastNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });


  	//route that displays customers table//
  	router.get("/", function(req, res){
    	var callbackCount = 0;
    	var context = {};
    	context.jsscripts = ["deleteperson.js","searchcustomers.js"];
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

  	//route that handles the page where a customer is updated from 
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

  	//put route that updates customer's information in Customers table
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

  	//deletes a given customer from the Customers table
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