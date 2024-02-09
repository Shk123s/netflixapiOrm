const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
// const bodyParser = require("body-parser");
// app.use(bodyParser.json({ type: "application/json" }));
const router = express.Router();
const getStatus = async(req,res)=>{

  try{  const {  limit, offset } = req.query;
  console.log(req.query)
 const quertstring = "select id,type,created_at,user_id from status ORDER BY id desc limit ? offset ? ";
 const [response] = await connection.promise().execute(quertstring,[limit, offset]);
 const querycount = 'select count(*) as count from status'
 const [responsecount] = await connection.promise().execute(querycount);

 res.status(200).send({
     message:"status  list",
     response,
     responsecount:responsecount[0].count
 });

} catch (error) {
 res.status(500).send(error);
 console.log(error)
}


}
const getStatusById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select id,type,created_at,user_id from status where id=?";
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
            message:"status not found ",
            response
        });
    }else{
        res.status(200).send({
            message:"status found ",
            response
        });
    }
   
  } catch (error) {
    res.status(500).send(error);
  }


}
const updateUser= async(req,res)=>{
   
try {
   const {id} = req.params;
    const { type,created_at ,user_id} = req.body;
    console.log(req.body  )
    const string = `UPDATE   status SET type=?,created_at=? ,user_id=? where id=?`;
    const  [results] = await connection.promise().execute(string,[type,created_at ,user_id,id]);
 if (results.affectedRows === 1) {
  
res.status(200).send({
  message:"Done updating",
  results
});
 }
 else{
  res.status(400).send({
    message:"not updated ",
    results
});
 }
    // console.log(results)
    
} catch (error) {
    res.status(500).send({
        message:"Internal server error" });
        console.log(error)
}



}


const deleteStatus= async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from status where id=?";
    const results = await connection.promise().execute(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "status Not found",
      });
    } else {
      if(results[0].affectedRows === 1){
        res.status(200).send({
          message: "status deleted successfully",
          results:results[0],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "user not found",
      error,
    });
  }
};
const addStatus = async (req, res) => {
  try {
    const { type,created_at,user_id } = req.body;
    console.log(req.body);
    let queryStrng = `insert into status( type,created_at,user_id) values( ?,? ,?)`;
    const [results] = await connection
      .promise()
      .execute(queryStrng, [type,created_at,user_id]);
    res.status(201).send({
      message: "status successfully added ",
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
app.get("/v1/status", getStatus);
app.get("/v1/status/:id", getStatusById);
app.put("/v1/status/:id", updateUser);
app.post("/v1/status", addStatus);
app.delete("/v1/status/:id", deleteStatus);


