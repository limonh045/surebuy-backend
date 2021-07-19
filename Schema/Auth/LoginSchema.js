const mongoose = require("mongoose");
const Joi = require('joi');

const LoginSchema = new mongoose.Schema({
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
});

const LoginJoi = Joi.object({
  gmail:Joi.required(),
  password:Joi.string().required().min(6)
});
module.exports = {LoginSchema,LoginJoi};
