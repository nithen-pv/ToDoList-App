require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const date = require(__dirname + "/date.js");

const app = express();

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.wa92s.mongodb.net/ToDoDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},(err)=>{
  if (!err) {
    console.log("MongoDB connected successfully ");
  }
});

mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("view engine", "ejs");

let dynamicRoute = "";

const itemSchema = new mongoose.Schema({
  name: String,
});

const customItemScheme = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const Item = mongoose.model("Item", itemSchema);

const customItem = mongoose.model("customItem", customItemScheme);

const item1 = new Item({ name: "car" });
const item2 = new Item({ name: "bike" });
const item3 = new Item({ name: "scooter" });

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  let day = date.getDate();
  Item.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Items inserted successfully");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { title: day, item: result });
      }
    }
  });
});

app.get("/:urlname", (req, res) => {
  console.log(req.params.urlname);
  dynamicRoute = _.capitalize(req.params.urlname);
  let day = req.params.urlname;
  customItem.findOne({ name: dynamicRoute }, (err, result) => {
    if (!err) {
      if (!result) {
        const newItem = new customItem({
          name: dynamicRoute,
          items: defaultItems,
        });
        newItem.save();
        res.redirect("/" + dynamicRoute);
      } else {
        res.render("list", { title: result.name, item: result.items });
      }
    }
  });
});

app.post("/", (req, res) => {
  item = req.body.itemName;
  listName = req.body.addBtn;
  const newItem = new Item({ name: item });
  let day = date.getDate();
  if (listName === day) {
    newItem.save();
    res.redirect("/");
  } else {
    customItem.findOne({ name: listName }, (err, result) => {
      if (!err) {
        result.items.push(newItem);
        result.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", (req, res) => {
    let day = date.getDate();
  const itemID = req.body.checkbox;
  const listTitle = req.body.listTitle;
  if (listTitle === day) {
    Item.findByIdAndRemove(itemID, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("item removed successfully");
        res.redirect("/");
      }
    });
  } else {
    customItem.findOneAndUpdate(
      { name: listTitle },
      { $pull: { items: { _id: itemID } } },
      (err,result) => {
        if (!err) {
          res.redirect("/" + listTitle);
        }
      }
    );
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log("server has started successfully",port);
});
















