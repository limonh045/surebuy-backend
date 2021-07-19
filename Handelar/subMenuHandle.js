const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const subMenuSchema = require("../Schema/subMenuSchema");
const menuSchema = require("../Schema/addMenuSchema");
const Menu = new mongoose.model("Menu", menuSchema);
const SubMenu = new mongoose.model("SubMenu", subMenuSchema);


router.post("/addsubmenu", async (req, res) => {
const menu = await Menu.find({_id:req.body.menuId})
req.body.bread=[menu[0].catagory,req.body.catagory]
  const submenu = await new SubMenu(req.body);
  try {
      const result = await submenu.save()
     await Menu.findOneAndUpdate(
        { _id: req.body.menuId },
        {
          $push: {
            submenu: result._id
          },
        }
      )
      
      
      res.send(result);
  
  } catch (err) {
    for (ex in err.errors) {
      res.status(400).send(err.errors[ex].message);
    }
  }
});

router.get("/submenu", async (req, res) => {
  const result = await SubMenu.find().populate({
    path: "childmenu",
    model: "ChildMenu",
    
  });
  res.send(result);
});

module.exports = router;
