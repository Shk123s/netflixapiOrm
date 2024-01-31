const express = require("express");
const connection = require("./database");
const app = express();
// const index= require("./index")
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));

const getProfile = async (req, res) => {
  try {
    // console.log("hhh")
    const quertstring = "select * from profiles";

    
    const [response] = await connection.promise().execute(quertstring);
    res.status(200).send({
      message: "User ",
      response,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
const getProfileById = async (req, res) => {
  try {
    // console.log("hhh")
    const { id } = req.params;
    const quertstring = "select * from profiles where id=?";
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
    const string = `UPDATE   casts SET name=?,limits=? ,type=?,created_at=?,updated_at=?,user_id=? where id=?`;
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
    res.status(200).send({
      message: "Done updating",
      results,
    });
    console.log(results);
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
    const {  name,
        limits,
        type,
        created_at,
        updated_at,
        user_id } = req.body;
    console.log(req.body);
    let queryStrng = `insert into videos(  name,
        limits,
        type,
        created_at,
        updated_at,
        user_id,) values( ?,? ,?,?,?,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [name,
        limits,
        type,
        created_at,
        updated_at,
        user_id]);
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
app.get("/profile", getProfile);
app.get("/profile/:id", getProfileById);
app.put("/profile/:id", updateProfile);
app.post("/profile", addActor);
app.delete("/profile/:id", deleteProfile);

app.listen(3000, () => {
  console.log("3000 server started acotrs");
});
