const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  itemCatagory: String,
  photo: String,
  measurements:String,
  quantity:{type:Number,default:00}
});

module.exports = itemSchema;
