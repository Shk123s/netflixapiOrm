const express = require("express");
const sequelize = require("./database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const usermodel = require("./Models/UserModel");
const jwt = require('jsonwebtoken');

const getuser = async (req, res) => {
    try {
      const {is_active, limit, offset ,sortby} = req.query;
     console.log(req.query)
      if (!req.query.is_active) {
        res.status(400).send({
          message: "missing parameter",
        });
      } else {
        // console.log(is_active)
        const sqlquery =
          `select names,created_at,updated_at,is_active from users where is_active=? ORDER BY id ${sortby} limit ? OFFSET   ? `;
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
      const {id, email, password, names, is_active, created_at } = req.body;
    
     
      const  passhass = await  bcrypt.hash(password, saltRounds);
      // console.log(req.body);
      let queryStrng = await usermodel.create({
        email:email,
        password:passhass ,
        names:names,
        is_active:is_active,
        created_at:created_at});

      // const [results] = await connection
      //   .promise()
      //   .execute(queryStrng, [email, passhass, names, is_active, created_at]);


      res.status(201).send({
        message: "user successfully added ",
        queryStrng,
      });
      // console.log(results);
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
      const queryStrng = "update users set is_active=0 where id=?";
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
  const usersprofile = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).send({message:"bad request"})
      }
     else
     { const queryStrng = "select users.names as username,profiles.name as profilename,profiles.type ,profiles.is_active from users join profiles on users.id=profiles.user_id where users.id = ?";
     const [results] = await connection.promise().query(queryStrng, [id]);
     if (results.length === 0) {
      res.send({ message: " user not found" });
    } else {
      res.status(200).send({
        message: "user with profiles found",
        result: results,
      });
    }
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
   
      if (!email ||  !password ) {
        res.status(400).send({
          message: "missing parameter",
        });
      } 
      // const  sqlquery2 = "select id ,email ,password from users where email=?";
      
        const [resultspassword] = await usermodel.findAll({ where: { email:email} })
           
         
          // console.log(resultspassword.password)

          if ( resultspassword.length === 0) {
            res.status(400).send({message:"Invalid credentails"});
          }
        
        const hasspassword = resultspassword.password;
        const passedpassword = await bcrypt.compare(password,hasspassword);
        // console.log(passedpassword)
        const token = jwt.sign({user_id:resultspassword.id,},"shhhhh");
        //  console.log(token.user_id)
        if ( !passedpassword) {
        
          res.status(400).send({message:"incorrect password"});
        }
        res.status(200).send({
          message: "Login successfully",
          resultspassword,
          token
        });
        
    } 
    catch (error) {
      res.status(500).send({
        message: "Internal server error"
      });
      console.log(error);
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

const middleware = (req,res,next)=>{
   if (req.headers && req.headers.token) {
    try {
      
      const token = req.headers.token;
      const decodetoken = jwt.verify(token,"shhhhh")
    } catch (error) {
      res.status(200).send({message:"Invalid token"})
    }
    next()
    return;
   }
   res.status(400).send({
    message: "Token Required"
  })
  } 
  
  

router.post("/v1/users/login",userLogin);
router.post("/v1/users/forgetpassword", forgetpassword);
router.post("/v1/users/resetpassword",resetpassword)
router.post("/v1/users", Addusers);
router.get("/v1/users", middleware,getuser);
router.put("/v1/users/:id", updateUser);
//soft delete 
router.post("/v1/users/:id", deleteUser);
router.get("/v1/usersprofile/:id", usersprofile);
router.get("/v1/usersdetails/:id", getDetails);

module.exports = router;