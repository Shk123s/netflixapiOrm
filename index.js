const express = require("express");
const connection = require("./database");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));
const getuser = async (req, res) => {
  try {
    const {is_active, limit, offset ,sortby} = req.query;
   console.log(req.query)
    if (!req.query.is_active) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {
      const sqlquery =
        `select * from users where is_active=? ORDER BY id ${sortby} limit ? OFFSET ? `;
      const [results] = await connection
        .promise() 
        .execute(sqlquery, [is_active,sortby, limit, offset]);
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
 if(!id){
  res.status(400).send({
    message:"Id required"
  })
 }
    let setData = [];
    let queryData = [];
    if (email) {
      setData.push("email=?");
      queryData.push(email)
    }
    if (password) {
      setData.push("password=?");
      queryData.push(password)
    }
    if (names) {
      setData.push("names=?");
      queryData.push(names);
    }
    if (is_active) {
      setData.push("is_active=?");
      queryData.push(is_active);
    }
    if (created_at) {
      setData.push("created_at=?");
      queryData.push(created_at);
    }
    const setString = setData.join(',');
    console.log(queryData);
    console.log(setString)
    const { email, password, names, is_active, created_at } = req.body;
    let queryStrng = `update   users set ${setString} where id=? `;
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

const userLogin = async (req,res)=>{
  try {
    const {email,password} = req.body;
   console.log(req.body)
    if (!email ||  !password ) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {  
      const sqlquery =
        `select email,password from users where email=? and password =? `;
      const [results] = await connection
        .promise() 
        .execute(sqlquery, [email,password]);
      
        if ( results.length === 0) {
          res.status(500).send({message:"Invalid credentails"})
        }
        
     else{
      res.status(200).send({
        message: "Login successfully",
        result: results,
      });
     }}
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    // console.log(error);
  }
}
const forgetpassword = async(req,res)=>{
 
 try {
    const min = 1000;
    const max = 9999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    const { email } = req.body;
    
    // console.log(otp);
    let queryStrngotp = `update users set  otp =${otp} where email = ? `;
    const [results] = await connection
      .promise()
      .query(queryStrngotp,[email]);
   if (results.affectedRows === 1) {
    res.status(200).send({
      message: "otp sent",
      results,
    });
   }
   else{
    res.status(403).send({
      message: "Invalid email"
    });
   }
 } catch (error) {
  res.status(500).send({
    message: "Internal server error"
  });
 }

}
const resetpassword = async(req,res)=>{
  try {
    
    const { password,otp } = req.body;
    console.log(req.body);
    let queryStrngotp = `update users set  password = ? where  otp =? `;
    const [results] = await connection
      .promise()
      .query(queryStrngotp,[password,otp]);
   if (results.affectedRows === 1) {
    res.status(201).send({
      message: "password updated ",
      results,
    });
   }
   else{
    res.status(401).send({
      message: "Invalid otp"
    });
   }
 } catch (error) {
  res.status(201).send({
    message: "Internal server error"
  });
 }

}
app.get("/v1/users/login", userLogin);
app.post("/v1/users/forgetpassword", forgetpassword);
app.post("/v1/users/resetpassword",resetpassword)
app.post("/v1/users", Addusers);
app.get("/v1/users", getuser);
app.put("/v1/users/:id", updateUser);
app.delete("/v1/users/:id", deleteUser);
app.get("/v1/users/:id", getUserbyid);
app.get("/v1/usersdetails/:id", getDetails);
app.listen(3000, () => {
  console.log("3000 server started");
});



