const mongoose = require("mongoose");
const Joi = require('joi');

const signUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required:true,
    uppercase:true
  },
  gmail: {
    type: String,
    required:true,
    unique:true,
  },
  password: {
    type: String,
    required:true,
    minlength:6
  },
  role:{
    type:Number
  }
});

const joiSchema = Joi.object({
  username:Joi.string().min(3),
  gmail:Joi.required(),
  password:Joi.string().required().min(6)
});
module.exports = {signUpSchema,joiSchema};
