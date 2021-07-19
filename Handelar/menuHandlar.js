const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const menuSchema = require("../Schema/addMenuSchema");
const Menu = new mongoose.model("Menu", menuSchema);

router.post("/addmenu", async (req, res) => {
req.body.bread=[req.body.catagory]
  const menu = await new Menu(req.body); 
  try {
    const result = await menu.save();
    res.send(result);
  } catch (err) {
    for (ex in err.errors) {
      res.status(400).send(err.errors[ex].message);
    }
  }
}); 

router.get("/menu", async (req, res) => {
  const result = await Menu.find().populate({
    path: "submenu",
    model: "SubMenu",
    populate: {
      path: "submenu",
      model: "ChildMenu",
    },
  });
  res.send(result);
});
module.exports = router;
