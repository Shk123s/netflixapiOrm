const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getcasts = async(req,res)=>{

 
  try {
    const {  limit, offset } = req.query;
    //  console.log(req.query)
    const quertstring = "select id,actor_id,created_at from casts ORDER BY id desc limit ? offset ? ";
    const [response] = await connection.promise().execute(quertstring,[limit, offset]);
    const querycount = 'select count(*) as count from casts'
    const [responsecount] = await connection.promise().execute(querycount);

    res.status(200).send({
        message:"casts list",
        response,
        responsecount:responsecount[0].count
    });
  } catch (error) {
    res.status(500).send(error);
  }

}
const getCastsById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select actor_id,created_at from casts where id=?";
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
const updateCasts = async(req,res)=>{
   
try {
   const {id} = req.params;
    const {  created_at,updated_at,actor_id} = req.body;
    console.log(req.body  )
    const string = `UPDATE   casts SET  created_at=?,updated_at=?,actor_id=? where id=?`;
    const  [results] = await connection.promise().execute(string,[ created_at,updated_at,actor_id,id]);
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


const deleteCasts = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from casts where id=?";
    const results = await connection.promise().query(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "cast Not found",
      });
    } else {
      res.status(200).send({
        message: "cast deleted successfully",
        results:results[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "cast not found",
      error,
    });
  }
};
const addCasts = async (req, res) => {
  try {
    const { created_at,updated_at,actor_id } = req.body;
    console.log(req.body);
    let queryStrng = `insert into casts( created_at,updated_at,actor_id) values( ?,?,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [created_at,updated_at,actor_id]);
    res.status(201).send({
      message: "casts successfully added ",
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
app.get("/v1/casts", getcasts);
app.get("/v1/casts/:id", getCastsById);
app.put("/v1/casts/:id", updateCasts);
app.post("/v1/casts", addCasts);
app.delete("/v1/casts/:id", deleteCasts);


app.listen(3000, () => {
    console.log("3000 server started acotrs");
  });