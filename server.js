const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
var items = [];
var workItems = [];

app.get("/" , function(req, res)
{
  var today = new Date();
  var options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  }
  var day = today.toLocaleDateString("en-US", options);
  res.render('index' , {listTitle:day , itemnames : items});
});


app.post("/", function(req , res)
{
  var listName = req.body.button;
  console.log(req.body);
  if(listName==="Work")
  {
    workItems.push(req.body.newitem);
    res.redirect("/work");

  }
  else {
    items.push(req.body.newitem);
    res.redirect("/");
  }

});



app.get("/about", function(req , res)
{
  res.render('about');
});


app.get("/work", function(req , res)
{
  res.render('index' , {listTitle: "Work List" , itemnames:workItems})
});



app.post("/work" , function(req , res)
{
    workItems.push(req.body.newitem);
    res.redirect("/work");
});



app.listen(process.env.PORT || 3000 , function(req,res)
{
  console.log("server started");
});
