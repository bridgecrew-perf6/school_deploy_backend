const { ROLES } = require("../constants");
const User = require("../models/user");

exports.populateTeacherRole = (req, res, next) => {
  req.body.role = ROLES.TEACHER;
  next();
};

exports.getAllTeachers = async (req, res) => {
  const teachers = await User.find({ role: ROLES.TEACHER });
  res.json(teachers);
};

exports.createUser = async (req, res) => {
  try {
    const newUser = User(req.body);
    const user = await newUser.save();
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndRemove(userId);
    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
