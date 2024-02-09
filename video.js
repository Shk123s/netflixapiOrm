const express = require("express");
const connection = require("./database");
const router = express.Router();
// const index= require("./index")
// const bodyParser = require("body-parser");
// router.use(bodyParser.json({ type: "routerlication/json" }));

const getVideo = async(req,res)=>{

  try{  const {  limit, offset } = req.query;
  console.log(req.query)
 const quertstring = "select id,title,description,is_active,created_at,user_id from videos ORDER BY id desc limit ? offset ? ";
 const [response] = await connection.promise().execute(quertstring,[limit, offset]);
 const querycount = 'select count(*) as count from videos'
 const [responsecount] = await connection.promise().execute(querycount);

 res.status(200).send({
     message:"video  list",
     response,
     responsecount:responsecount[0].count
 });

} catch (error) {
 res.status(500).send(error);
 console.log(error)
}

}
const getVideoById = async(req,res)=>{

  try {
    // console.log("hhh")
    const {id} = req.params;
    const quertstring = "select id,title,description,is_active,user_id from videos where id=?";
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
    
} catch (error) {
    res.status(500).send({
        message:"Internal server error" });
        console.log(error)
}



}


const deleteVideo= async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from videos where id=?";
    const results = await connection.promise().execute(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "video Not found",
      });
    } else {
      res.status(200).send({
        message: "video deleted successfully",
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
const addVideo = async (req, res) => {
  try {
    const { title,description,is_active,created_at,user_id,cast_id } = req.body;
    console.log(req.body);
    let queryStrng = `insert into videos( title,description,is_active,created_at,user_id,cast_id) values( ?,? ,?,?,?,?)`;
    const [results] = await connection
      .promise()
      .execute(queryStrng, [title,description,is_active,created_at,user_id,cast_id]);
    res.status(201).send({
      message: "video successfully added ",
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
router.get("/v1/video", getVideo);
router.get("/v1/video/:id", getVideoById);
router.put("/v1/video/:id", updateActors);
router.post("/v1/video", addVideo);
router.delete("/v1/video/:id", deleteVideo);


module.exports = router;