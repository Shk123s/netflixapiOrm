const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getActors = async(req,res)=>{

  try {
    // console.log("hhh")
    const quertstring = "select * from actors";

    const [response] = await connection.promise().execute(quertstring);
    res.status(200).send({
        message:"User ",
        response
    });
  } catch (error) {
    res.status(500).send(error);
  }


}
const getActorsById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select * from actors where id=?";
    if(!id)
    {
        res.status(400).send({
            message:"id required "
           
        }); 
    }
    const [response] = await connection.promise().execute(quertstring,[id]);
    if(response.length === 0 )
    {
        res.status(400).send({
            message:"User not found ",
            response
        });
    }else{
        res.status(200).send({
            message:"User found ",
            response
        });
    }
   
  } catch (error) {
    res.status(500).send(error);
  }


}
const updateActors = async(req,res)=>{
   
try {
   const {id} = req.params;
    const { name,created_at ,is_active} = req.body;
    console.log(req.body  )
    const string = `UPDATE   actors SET name=?,created_at=? ,is_active=? where id=?`;
    const  [results] = await connection.promise().execute(string,[name,created_at ,is_active,id]);
    res.status(201).send({
        message:"Done updating",
        results
    });
    console.log(results)
    
} catch (error) {
    res.status(500).send({
        message:"Internal server error" });
        console.log(error)
}



}
app.get("/actors", getActors);
app.get("/actors/:id", getActorsById);
app.put("/actors/:id", updateActors);
// app.put("/users/:id", updateUser);
// app.delete("/users/:id", deleteUser);


app.listen(3000, () => {
    console.log("3000 server started acotrs");
  });