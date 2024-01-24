const express = require("express");
const connection = require("./database");
const app = express();
app.get("/", (req, res) => {
  console.log("hello world");
  res.send("hello postmon");
});
app.get("/users", async (req, res) => {
  try {
    const [results] = await  connection.promise().query("select * from users")
    res.send(results)
    console.log(results)
    
  } catch (error) {
    console.log(error)
  }
});
app.listen(3000, () => {
  console.log("3000 server started");
});
