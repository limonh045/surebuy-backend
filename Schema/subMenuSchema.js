const mongoose = require("mongoose");

const AddSubMenu = new mongoose.Schema({
  catagory: String,

  menuId: {
    type: String,
    default: "23523",
  },
  banner: {
    type: Array,
  },
  tumbail: String,
  bread: Array,
  isExpand: {
    type: Boolean,
    default: false,
  },
  submenu: [{ type: mongoose.Types.ObjectId, ref: "ChildMenu" }],
});

module.exports = AddSubMenu;
