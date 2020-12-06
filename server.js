const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
var items = [];

app.get("/" , function(req, res)
{
  var today = new Date();
  var options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  }
  var day = today.toLocaleDateString("en-US", options);
  res.render('index' , {kindofday:day , itemnames : items});
});


app.post("/", function(req , res)
{
  items.push(req.body.newitem);
  res.redirect("/");
});

app.listen(process.env.PORT || 3000 , function(req,res)
{
  console.log("server started");
});
