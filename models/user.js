const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid email Id!`,
    },
  },
  encry_password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    enum: [ROLES.TEACHER, ROLES.ADMIN],
  },
  subject: {
    type: Array(String),
    required: true,
    default: [],
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  aadharNum: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
  },
  salary: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
