const { ROLES } = require("../constants");
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const populateTeacherRole = (req, res, next) => {
  req.body.role = ROLES.TEACHER;
  next();
};

const getAllTeachers = async (req, res) => {
  const teachers = await User.find({ role: ROLES.TEACHER });
  res.json(teachers);
};

const createUser = async (req, res) => {
  try {
    const newUser = User(req.body);
    const user = await newUser.save();
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // mongoose.Types.ObjectId(userId)
    const user = await User.findById(userId);
    if (user) {
      res.json({ user });
    } else {
      res.status(400).json({ msg: "Invalid User Id" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const salt_rounds = 10;
    const encry_password = await bcrypt.hash(req.body["password"], salt_rounds);
    req.body["encry_password"] = encry_password;
    delete req.body["password"];
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndRemove(userId);
    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  populateTeacherRole,
  getAllTeachers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
