const express = require("express");
const connection = require("./database");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));
const getuser = async (req, res) => {
  try {
    const { is_active, limit, offset } = req.query;
   
    if (!req.query.is_active) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {
      const sqlquery =
        "select * from users where is_active=? order by names asc limit ? OFFSET ? ";
      const [results] = await connection
        .promise()
        .execute(sqlquery, [is_active, limit, offset]);
        const queryStrngCount = "select count(*) as count from users";
        const [resultsCount] = await connection.promise().query(queryStrngCount);
        if (!results || results.length === 0) {
          res.status(404).send({message:"user not found"})
        }
        
     else{
      res.status(200).send({
        message: "done successfully",
        result: results,
        TotalUsercount:resultsCount[0].count
      });
      // console.log(results);
     }
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    // console.log(error);
  }
};
const Addusers = async (req, res) => {
  try {
    const { email, password, names, is_active, created_at } = req.body;
    console.log(req.body);
    let queryStrng = `insert into users(email ,password ,names,is_active,created_at) values(? ,? ,?,? ,?)`;
    const [results] = await connection
      .promise()
      .query(queryStrng, [email, password, names, is_active, created_at]);
    res.status(201).send({
      message: "user successfully added ",
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
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    //  console.log(id)
    const { email, password, names, is_active, created_at } = req.body;
    let queryStrng = `update   users set email=? ,password=? ,names=?,is_active=?,created_at=? where id=? `;
    const [results] = await connection
      .promise()
      .query(queryStrng, [email, password, names, is_active, created_at, id]);

    res.status(201).send({
      message: "user updated  added ",
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error while operation",
      error,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "delete from users where id=?";
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
const getUserbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStrng = "select * from users where id=?";
    const [results] = await connection.promise().query(queryStrng, [id]);

    if (results.length === 0) {
      res.send({ message: " user not found" });
    } else {
      res.status(200).send({
        message: "user found",
        result: results[0],
      });
    }
    // console.log(results[0])
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
    });
  }
};
const getDetails =  async (req,res)=>{
 try {
  const {id} = req.params;
  const queryStrng = "select id, email,names ,is_active from users where id=? "
 const [results] = await connection.promise().query(queryStrng,[id]);
if (!results || results.length === 0) {
  res.status(404).send({message:"user not found"})
}
else{
  res.status(200).send({
    message:" Users List ",
    list :results
  });
  // console.log(resultsCount)
  //  console.log(results);
}
  
 } catch (error) {
  res.status(500).send({
    message:"Internal server error",
    error:error
  });
  console.log(error);
 }
};

app.post("/users", Addusers);
app.get("/users", getuser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
app.get("/users/:id", getUserbyid);
app.get("/usersdetails/:id", getDetails);
app.listen(3000, () => {
  console.log("3000 server started");
});
