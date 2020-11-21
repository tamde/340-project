var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


app.use('/static', express.static('public'));
app.use('/', require('./home.js'));
app.use('/games', require('./games.js'));

// app.get("/", function(req, res, next){
//   res.render("home");
// });

// app.get("/games", function(req,res,next){
// 	res.render("games");
// });




app.use(function(req, res){
	res.status(404);
	res.render("404");
});

app.use(function(err, req, res, next){
	console.log(err.stack);
	res.status(500);
	res.render("500");
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });