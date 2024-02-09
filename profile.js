const express = require("express");
const connection = require("./database");

// const index= require("./index")
const bodyParser = require("body-parser");
// router.use(bodyParser.json({ type: "routerlication/json" }));


const router = express.Router();
const getProfile = async (req, res) => {
try{  const {  limit, offset } = req.query;
   console.log(req.query)
  const quertstring = "select id,name,limits,type,created_at,user_id from profiles ORDER BY id desc limit ? offset ? ";
  const [response] = await connection.promise().execute(quertstring,[limit, offset]);
  const querycount = 'select count(*) as count from profiles'
  const [responsecount] = await connection.promise().execute(querycount);

  res.status(200).send({
      message:"profile  list",
      response,
      responsecount:responsecount[0].count
  });
 
} catch (error) {
  res.status(500).send(error);
  console.log(error)
}
};
const getProfileById = async (req, res) => {
  try {
    // console.log("hhh")
    const { id } = req.params;
    const quertstring = "select id, name ,limits,type,created_at from profiles where id=?";
    if (!id) {
      res.status(400).send({
        message: "id required ",
      });
    }
    const [response] = await connection.promise().execute(quertstring, [id]);
    if (response.length === 0) {
      res.status(400).send({
        message: "User not found ",
        response,
      });
    } else {
      res.status(200).send({
        message: "User found ",
        response,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, limits, type, created_at, updated_at, user_id } = req.body;
    console.log(req.body);
    const string = `UPDATE   profiles SET name=?,limits=? ,type=?,created_at=?,updated_at=?,user_id=? where id=?`;
    const [results] = await connection
      .promise()
      .execute(string, [
        name,
        limits,
        type,
        created_at,
        updated_at,
        user_id,
        id
      ]);
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
      message: "Internal server error",
    });
    console.log(error);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from profiles where id=?";
    const results = await connection.promise().query(queryStrng, [id]);
    //  console.log(results)///
    if (results[0].affectedRows === 0) {
      res.status(404).send({
        message: "user Not found",
      });
    } else {
      res.status(200).send({
        message: "profile deleted successfully",
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
const addProfile = async (req, res) => {
  try {
    const {  name,
        limits,
        type,
        created_at,
        updated_at,
        user_id } = req.body;
    console.log(req.body);
    let queryStrng = `insert into profiles(  name,limits,type,created_at,updated_at,user_id) values( ?,? ,?,?,?,?)`;
    const [results] = await connection
      .promise()
      .execute(queryStrng, [name,  limits,type,created_at,updated_at,user_id]);
    res.status(201).send({
      message: "profile successfully added ",
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
router.get("/v1/profile", getProfile);
router.get("/v1/profile/:id", getProfileById);
router.put("/v1/profile/:id", updateProfile);
router.post("/v1/profile", addProfile);
router.delete("/v1/profile/:id", deleteProfile);

module.exports = router;