const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Joi = require("joi");

// SCHEMA MODEL
const { signUpSchema, joiSchema } = require("../Schema/Auth/signUpSchema");
const SignUp = new mongoose.model("SignUp", signUpSchema);

const { LoginSchema, LoginJoi } = require("../Schema/Auth/LoginSchema");
const Login = new mongoose.model("Login", LoginSchema);


router.get("/adduser", async (req, res) => {
  const item = await SignUp.find();
  res.send(item);
})
router.post("/adduser", async (req, res) => {
  const gmail = await SignUp.find({ gmail: req.body.gmail });

  if (gmail && gmail.length > 0) {
    res.status(400).send("gmail already registared");
    return;
  }
  const joischema = joiSchema.validate(req.body);
  if (joischema.error) return res.send(joischema.error.details[0].message);

  const hassPass = await bcrypt.hash(req.body.password, 10);
  const singup = await new SignUp({
    username: req.body.username,
    gmail: req.body.gmail,
    password: hassPass,
    role:1
  });

  try {
    await singup.save();
    var token = jwt.sign(
      { username: req.body.username },
      process.env.JWT_SECRET
    );
    res.send({message:'User addded successfuly'});
  } catch (err) {
    for (ex in err.errors) {
      res.status(400).send(err.errors[ex].message);
    }
  }
})
// ROUTER ASSIGN FOR SIGN UP
router.post("/signup", async (req, res) => {
  const gmail = await SignUp.find({ gmail: req.body.gmail });

  if (gmail && gmail.length > 0) {
    res.status(400).send("gmail already registared");
    return;
  }
  const joischema = joiSchema.validate(req.body);
  if (joischema.error) return res.send(joischema.error.details[0].message);

  const hassPass = await bcrypt.hash(req.body.password, 10);
  const singup = await new SignUp({
    username: req.body.username,
    gmail: req.body.gmail,
    password: hassPass,
    role:0
  });

  try {
    await singup.save();
    var token = jwt.sign(
      { username: req.body.username },
      process.env.JWT_SECRET
    );
    res.send({token,role:0,message:'Admin addded successfuly'});
  } catch (err) {
    for (ex in err.errors) {
      res.status(400).send(err.errors[ex].message);
    }
  }
});

router.delete('/user/:id',async(req,res)=>{
   SignUp.deleteOne({ _id: req.params.id }).then(()=>{
    res.send('User delete')
  })
  .catch(err=>{
    res.send(err)
  })


})

// ROUTER ASSIGN FOR LOGIN
router.post("/login", async (req, res) => {
  const loginSchema = LoginJoi.validate(req.body);
  if (loginSchema.error) return res.send(loginSchema.error.details[0].message);

  const gmail = await SignUp.find({ gmail: req.body.gmail });

  if (gmail && gmail.length > 0) {
    const comparePass = await bcrypt.compare(
      req.body.password,
      gmail[0].password
    );
    if (comparePass) {
      var token = jwt.sign(
        { username: gmail[0].username },
        process.env.JWT_SECRET
      );
      res.send({token,role:gmail[0].role,message:'Login successfuly'});

    } else {
      res.status(400).send("gmail or password not match");
    }
  } else {
    res.status(400).send("gmail or password not match");
  }
});
module.exports = router;
