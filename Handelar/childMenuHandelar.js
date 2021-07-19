const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const subMenuSchema = require("../Schema/subMenuSchema");
const childMenuSchema = require("../Schema/childMenuSchema");
const addMenuSchema = require("../Schema/addMenuSchema");
const ChildMenu = new mongoose.model("ChildMenu", childMenuSchema);
const SubMenu = new mongoose.model("SubMenu", subMenuSchema);
const Menu = new mongoose.model("Menu", addMenuSchema);


router.post("/addchildmenu", async (req, res) => {
const menu = await Menu.find({_id:req.body.menuId})
const sub = await SubMenu.find({_id:req.body.subMenuId})
req.body.bread=[menu[0].catagory,sub[0].catagory,req.body.catagory]
  const childmenu = await new ChildMenu(req.body);
  try {
      const result = await childmenu.save()
     await SubMenu.findOneAndUpdate(
        { _id: req.body.subMenuId },
        {
          $push: {
            submenu: result._id
          },
        }
      );
      console.log(req.body.subMenuId);
      res.send(result);
  
  } catch (err) {
    for (ex in err.errors) {
      res.status(400).send(err.errors[ex].message);
    }
  }
});

router.get("/childmenu", async (req, res) => {
  const result = await ChildMenu.find();
  res.send(result);
});


module.exports = router;
