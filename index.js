const express = require("express");
const connection = require("./database");
const app = express();

const getuser =async ()=>{
  try {
    const [results] = await  connection.promise().query("select * from users")
    res.send(results)
    console.log(results)
    
  } catch (error) {
    console.log(error)
  }
}
const Addusers =async ()=>{
  try {
 const  { email ,password ,names,created_at ,updated_at }   = req.body
    const [results] = await  connection.promise().query(" insert into  users  ")
    res.send(results)
    console.log(results)
    
  } catch (error) {
    console.log(error)
  }
}
app.post("/users", Addusers);
app.get("/users", getuser);
app.patch("/users", Addusers);
app.delete("/users", getuser);




app.listen(3000, () => {
  console.log("3000 server started");
});
