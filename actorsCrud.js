const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getActors = async(req,res)=>{

  try {
    const {  limit, offset } = req.query;
    //  console.log(req.query)
    const quertstring = "select id,name from actors ORDER BY id desc limit ? offset ? ";
    const [response] = await connection.promise().execute(quertstring,[limit, offset]);
    const querycount = 'select count(*) as count from actors'
    const [responsecount] = await connection.promise().execute(querycount);

    res.status(200).send({
        message:"Actors list",
        response,
        responsecount:responsecount[0].count
    });
  } catch (error) {
    res.status(500).send(error);
  }


}
const getActorsById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select id,name,is_active from actors where id=?";
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
  console.log("object")
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


const deleteActor= async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from actors where id=?";
    const results = await connection.promise().query(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "actor Not found",
      });
    } else {
      res.status(200).send({
        message: "actor deleted successfully",
        results:results[0]
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "Internal server error",
      error,
    });
  }
};
const addActor = async (req, res) => {
  try {
    const {  name, is_active, created_at } = req.body;
    console.log(req.body);
    let queryStrng = `insert into actors( name,is_active,created_at) values( ?,? ,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [ name, is_active, created_at]);
    res.status(201).send({
      message: "actor successfully added ",
      results,
    });
    console.log(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error while operation",
    });
  }
};
app.get("/v1/actors", getActors);
app.get("/v1/actors/:id", getActorsById);
app.put("/v1/actors/:id", updateActors);
app.post("/v1/actors", addActor);
app.delete("/v1/actors/:id", deleteActor);


app.listen(3000, () => {
    console.log("3000 server started acotrs");
  });