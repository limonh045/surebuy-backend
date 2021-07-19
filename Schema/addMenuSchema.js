const mongoose = require("mongoose");

const AddMenu = new mongoose.Schema({
  catagory: String,
  banner: {
    type: Array,
  },
  bread:Array,
  icon:String,
  isExpand:{
 type:Boolean,
  default:false},
  submenu:[{
      type:mongoose.Types.ObjectId,
      ref:'SubMenu'
  }]
});

module.exports = AddMenu
