const mongoose = require("mongoose");

const childMenuSchema = new mongoose.Schema({
  catagory: String,
  banner: {
    type: Array,
  },
  subMenuId: {
    type: String,
  },
  bread: Array,
  tumbail: String,
});

module.exports = childMenuSchema;
