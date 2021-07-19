const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ItemSchema = require("../Schema/itemsSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Item = new mongoose.model("Item", ItemSchema);

const menuSchema = require("../Schema/addMenuSchema");
const Menu = new mongoose.model("Menu", menuSchema);

const subMenuSchema = require("../Schema/subMenuSchema");
const SubMenu = new mongoose.model("SubMenu", subMenuSchema);
const childMenuSchema = require("../Schema/childMenuSchema");
const ChildMenu = new mongoose.model("ChildMenu", childMenuSchema);

router.post("/item", async (req, res) => {
  req.body.quantity = 0;
  const item = await new Item(req.body);
  await item.save();
  res.end();
});
// {
  
//   itemCatagory: String,
// measurements: String,
// name: String,
// offer: Number,
// orderFrom: Number,
// photo: String,
// price: Number,
// quantity: Number,
 
// }
const order = new mongoose.Schema();
const Order = new mongoose.model("Order", order);

// router.post('/orders',async(req,res)=>{
//   // const menu = await new Order(req.body); 

//   //   const result = await menu.save();
//   //   res.send(result);
//   // const result = await Order.insertMany(req.body);
//   // res.send(result)
// })

router.get('/offer',async(req,res)=>{
  const item = await Item.find({offer:{$gt:0}});
  res.send(item)
})

router.get('/search/:name',async(req,res)=>{
  const name = req.params.name.split("-").join(" ");
  name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  // const escape = function (str) {
  //   return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // };
  const requ = new RegExp( name )
  const item = await Item.find({name:requ});
  res.send(item)
  // const name_search_regex = new RegExp(escape(searchQuery), "i");
  // const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  // const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i
})

router.get("/item/:cat", async (req, res) => {
  const cat = req.params.cat.split("-").join(" ");

  const result = await Menu.find({ catagory: cat }).populate({
    path: "submenu",
    model: "SubMenu",
  });

  if ( result[0] && result[0].submenu) {
    res.send(result[0].submenu);
  } else {
    const resultsub = await SubMenu.find({ catagory: cat }).populate({
      path: "submenu",
      model: "ChildMenu",
    });
//  console.log(resultsub[0]);
    if (resultsub[0] && resultsub[0].submenu) {
      res.send(resultsub[0].submenu);
    } else {
      const item = await Item.find({ itemCatagory: cat });

      if (item.length) {
        res.send({ item, items: true });
      }else{
        res.send('No Data Found')
      }
    }
  }
});
 
router.delete("/delete/:id", async (req, res) => {
  const result = await Menu.deleteOne({ _id: req.params.id })
  if ( result && result.deletedCount) {
    res.send("Menu Delete Succesfully");
  } else{
    const results = await SubMenu.deleteOne({ _id: req.params.id })
    if ( results && results.deletedCount) {
      res.send("SubMenu Delete Succesfully");
    } else{
      const resultss = await Item.deleteOne({ _id: req.params.id })
      if ( resultss && resultss.deletedCount) {
        res.send("Item Delete Succesfully");
      }else{
        
        const resultsss = await ChildMenu.deleteOne({ _id: req.params.id })
      if ( resultsss && resultsss.deletedCount) {
        res.send("Child Delete Succesfully");
      }else{
        res.send('No Data Found')
      }
    }
  }}
});

router.get("/item/offer", async (req, res) => {
  const item = await Item.find();
  res.send(item);
});

router.get("/item", async (req, res) => {
  const item = await Item.find();
  res.send(item);
});
// const User = require("../models/people");

// router.post('/reg',async (req,res)=>{
//   let newUser;
//   const hashedPassword = await bcrypt.hash(req.body.password, 10);
//   newUser = new User({
//     ...req.body,
//     password: hashedPassword,
//   });
//   try {
//     const result = await newUser.save();
//     res.status(200).json({
//       message: "User was added successfully!",
//     });
//   } catch (err) {
//     res.status(500).json({
//       errors: {
//         common: {
//           msg: "Unknown error occured!",
//         },
//       },
//     });
//   }
// })
// router.post("/login", async (req, res) => {

//   try {
//     // find a user who has this email/username
//     const user = await User.findOne({
//       $or: [{ email: req.body.email }, { mobile: req.body.username }],
//     });

//     if (user && user._id) {
//       const isValidPassword = await bcrypt.compare(
//         req.body.password,
//         user.password
//       );

//       if (isValidPassword) {
//         // prepare the user object to generate token
//         const userObject = {
//           userid: user._id,
//           username: user.name,
//           email: user.email,
//           avatar: user.avatar || null,
//           role: user.role || "user",
//         };

//         // generate token
//         const token = jwt.sign(userObject, process.env.JWT_SECRET, {
//           expiresIn: process.env.JWT_EXPIRY,
//         });

//         // set cookie
//         res.cookie(process.env.COOKIE_NAME, token, {
//           maxAge: process.env.JWT_EXPIRY,
//           httpOnly: true,
//           signed: true,
//         });

//         // set logged in user local identifier
//         // res.locals.loggedInUser = userObject;

//         // res.redirect("inbox");
//         res.send(token)
//       } else {
//         res.send("Entered Wrong Email or Password");
//       }
//     } else {
//       res.send("Entered Wrong Email or Password");
//     }
//   } catch (err) {
//     res.status(500).json({
//       errors: {
//         common: {
//           msg: "Unknown error occured!",
//         },
//       },
//     });
//   }
// });

module.exports = router;
