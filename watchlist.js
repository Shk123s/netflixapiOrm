const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getWatchlists = async(req,res)=>{

  try {
    // console.log("hhh")
    const quertstring = "select * from watchlists";

    const [response] = await connection.promise().execute(quertstring);
    res.status(200).send({
        message:"User ",
        response
    });
  } catch (error) {
    res.status(500).send(error);
  }


}
const getWatchlistsById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select * from  watchlists where id=?";
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
    const {  last_watch , 
        video_id,
        status_id , 
        created_at ,
        } = req.body;
    console.log(req.body  )
    const string = `UPDATE   watchlists SET  last_watch=?,video_id=?,status_id=?,created_at=?, where id=?`;
    const  [results] = await connection.promise().execute(string,[ last_watch , 
        video_id,
        status_id , 
        created_at ,id]);
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
      message: "user not found",
      error,
    });
  }
};
const addWatchlists = async (req, res) => {
  try {
    const { last_watch , 
        video_id,
        status_id , 
        created_at  } = req.body;
    console.log(req.body);
    let queryStrng = `insert into casts( last_watch , 
        video_id,
        status_id , 
        created_at ) values(?, ?,?,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [last_watch , 
        video_id,
        status_id , 
        created_at ]);
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
app.get("/watchlists",getWatchlists);
app.get("/watchlists/:id", getWatchlistsById);
app.put("/watchlists/:id", updateWatchlists);
app.post("/watchlists", addWatchlists);
app.delete("/watchlists/:id", deleteWatchlists);


app.listen(3000, () => {
    console.log("3000 server started acotrs");
  });