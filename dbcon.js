var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_tamde',
  password        : '6854',
  database        : 'cs340_tamde'
});

module.exports.pool = pool;