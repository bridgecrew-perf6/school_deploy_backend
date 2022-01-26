const { ROLES } = require("../constants");
const User = require("../models/user");

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
    const user = await User.findById(userId);
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const updateStudent = async (req, res) => {
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

const deleteStudent = async (req, res) => {
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
  updateStudent,
  deleteStudent,
};
