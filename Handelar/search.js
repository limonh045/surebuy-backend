const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const subMenuSchema = require("../Schema/subMenuSchema");
const childMenuSchema = require("../Schema/childMenuSchema");
const addMenuSchema = require("../Schema/addMenuSchema");
const ChildMenu = new mongoose.model("ChildMenu", childMenuSchema);
const SubMenu = new mongoose.model("SubMenu", subMenuSchema);
const Menu = new mongoose.model("Menu", addMenuSchema);

router.get('/pageinfo/:cata',async (req,res)=>{
    const cat = req.params.cata.split("-").join(" ")

    const menu =await Menu.find({catagory:cat}).populate('submenu')
    if (menu[0]) {
        res.send(menu);
        return
    }
    const submenu = await SubMenu.find({catagory:cat}). populate({
        path: "submenu",
        model: "ChildMenu",
      })
    if (submenu[0]) {
        res.send(submenu);
        return
    }
    const childmenu = await ChildMenu.find({catagory:cat})
    if (childmenu[0]) {
        res.send(childmenu);
        return
    }
    
    
})

module.exports = router