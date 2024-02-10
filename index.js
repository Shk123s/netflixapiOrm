const express = require("express");
const app = express();
const user = require("./user");
const profile = require('./profile');
const video = require("./video");
const casts = require('./casts');
const actorsCrud = require('./actorsCrud');
const watchlist = require('./watchlist');
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));


app.use("/",user);
app.use("/",profile);
app.use("/",casts);
app.use("/",actorsCrud);
app.use("/",video);
app.use("/",watchlist);


app.listen(3000, () => {
  console.log("3000 server started");
});



