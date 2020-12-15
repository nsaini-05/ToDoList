const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var _ = require('lodash');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://admin-neeraj:Test123@cluster0.y7iw3.mongodb.net/taskListDB' , {useNewUrlParser : true , useUnifiedTopology : true});

const taskSchema = {name : String};
const Task = new mongoose.model("task" , taskSchema);


const morning = new Task({name : "Morning"});
const afternoon = new Task({name : "Afternoon"});
const night = new Task({name : "Night"});
const defaultItems = [morning, afternoon , night];

const listSchema = {name : String , items : [taskSchema]};
const List = new mongoose.model("list" , listSchema);






app.get("/" , function(req, res)
{
  Task.find({}, function(error, tasks)
  {


    if(tasks.length ===0)
    {
      Task.insertMany(defaultItems, function(error)
      {
        if(error)
        {
          console.log(error);
        }
        else {
          //console.log("Succesfully done ");
        }
      });
      res.redirect("/");
    }
    else{

      res.render('index' , {listTitle:"Today" , itemnames : tasks});
    }
  });
});



app.get('/:listname', function (req, res) {
  const customListName = _.startCase(req.params.listname);

  List.findOne({name:customListName} , function(err , list){
    if(!err){
      if(!list)
      {
        const list = new List({name : customListName , items: defaultItems});
        list.save();
        res.redirect("/" + customListName );

      }
      else {
        res.render("index",  {listTitle:customListName , itemnames : list.items});
      }
    }

  });
});





app.post("/", function(req , res)
{

  const newTaskName = req.body.newitem;
  const listName = req.body.button;
  const newTask = new Task({name : newTaskName});

  if(listName === "Today"){
    newTask.save();
    res.redirect("/");
  }
  else {
    List.findOne({name : listName} , function(err, list)
    {
      if(!err){
        list.items.push(newTask);
        list.save();
        res.redirect("/" + listName);
      }
      else {
        console.log(err);
      }
    })

  }

});





app.post("/delete", function(req , res)
{
  const listName = req.body.listName;
  const removeItemid = req.body.checkbox;

  if(listName === "Today"){
    Task.findByIdAndDelete(removeItemid , function(err){
      if(!err){  res.redirect("/");}
    });
  }
  else {

    List.findOneAndUpdate({name : listName } , {$pull:{items : {_id: removeItemid}}}, function(err,results){
      if(!err){res.redirect("/" + listName );}
    });
  }

});





app.listen(process.env.PORT || 3000 , function(req,res)
{
  console.log("server started");
});
