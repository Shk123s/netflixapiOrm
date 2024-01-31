const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getVideo = async(req,res)=>{

  try {
    // console.log("hhh")
    const quertstring = "select * from videos";

    const [response] = await connection.promise().execute(quertstring);
    res.status(200).send({
        message:"User ",
        response
    });
  } catch (error) {
    res.status(500).send(error);
  }


}
const getVideoById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select * from videos where id=?";
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
    const { title,description,is_active,created_at,updated_at,user_id,cast_id} = req.body;
    console.log(req.body  )
    const string = `UPDATE   videos SET title=?,description=? ,is_active=?,created_at=?,updated_at=?,user_id=?,cast_id=? where id=?`;
    const  [results] = await connection.promise().execute(string,[ title,description,is_active,created_at,updated_at,user_id,cast_id,id]);
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
    const queryStrng = "delete from videos where id=?";
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
const addActor = async (req, res) => {
  try {
    const { email, password, names, is_active, created_at } = req.body;
    console.log(req.body);
    let queryStrng = `insert into videos( title,description,is_active,created_at,updated_at,user_id,cast_id) values( ?,? ,?,?,?,?,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [email, password, names, is_active, created_at]);
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
app.get("/videos", getVideo);
app.get("/videos/:id", getVideoById);
app.put("/videos/:id", updateActors);
app.post("/videos", addActor);
app.delete("/videos/:id", deleteActor);


app.listen(3000, () => {
    console.log("3000 server started acotrs");
  });