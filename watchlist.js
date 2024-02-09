const express = require("express");
const connection = require("./database");

const router = express.Router();
// const index= require("./index")
// const bodyParser = require("body-parser");
// app.use(bodyParser.json({ type: "application/json" }));

const getWatchlists = async(req,res)=>{

  try{  const {  limit, offset } = req.query;
   console.log(req.query)
  const quertstring = "select id,last_watch,created_at,user_id,status_id from watchlists ORDER BY id desc limit ? offset ? ";
  const [response] = await connection.promise().execute(quertstring,[limit, offset]);
  const querycount = 'select count(*) as count from watchlists'
  const [responsecount] = await connection.promise().execute(querycount);

  res.status(200).send({
      message:"watchlist  list",
      response,
      responsecount:responsecount[0].count
  });
 
} catch (error) {
  res.status(500).send(error);
  console.log(error)
}

}
const getWatchlistsById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select last_watch,created_at,user_id,status_id from  watchlists where id=?";
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
const updateWatchlists = async(req,res)=>{
   
try {
   const {id} = req.params;
    const {  last_watch,created_at,user_id,status_id 
        } = req.body;
    console.log(req.body  )
    const string = `UPDATE   watchlists SET last_watch=? ,created_at=?,user_id=?,status_id=?  where id=?`;
    const  [results] = await connection.promise().execute(string,[ last_watch,created_at,user_id,status_id ,id]);
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
          });}
    
} catch (error) {
    res.status(500).send({
        message:"Internal server error" });
        console.log(error)
}



}


const deleteWatchlists = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from watchlists where id=?";
    const results = await connection.promise().query(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "user Not found",
      });
    } else {
      res.status(200).send({
        message: "user deleted successfully",
        results,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "Internal error",
      error,
    });
  }
};
const addWatchlists = async (req, res) => {
  try {
    const { last_watch,created_at,user_id,status_id  } = req.body;
    console.log(req.body);
    let queryStrng = `insert into watchlists( last_watch,created_at,user_id,status_id) values(?, ?,?,?)`;
    const [results] = await connection
      .promise()
      .execute(queryStrng, [last_watch,created_at,user_id,status_id ]);
    res.status(201).send({
      message: "watchlist successfully added ",
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
app.get("/v1/watchlists",getWatchlists);
app.get("/v1/watchlists/:id", getWatchlistsById);
app.put("/v1/watchlists/:id", updateWatchlists);
app.post("/v1/watchlists", addWatchlists);
app.delete("/v1/watchlists/:id", deleteWatchlists);

module.exports = router