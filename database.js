const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"12345",
     password:"password",
    // database:"netflix",
  database:"netflixdb",
    port:3306
})
connection.connect(function (err) {
    if (err) throw err;
    console.log("db Connected!");
  
  });

module.exports=connection