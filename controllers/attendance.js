const Attendance = require("../models/attendance");
const Student = require("../models/student");

const findGradeStudents = async (req, res) => {
  const { gradeName } = req.query;
  // console.log(gradeName);
  try {
    const students = await Student.find(
      { grade: gradeName },
      "registrationNumber studentName roll"
    );
    res.json(students);
  } catch (error) {
    console.log(error);
    res.json({ error: "INVALID GRADE NAME" });
  }
};

const checkDuplicate = async (req, res, next) => {
  const { grade, section } = req.body;
  let currDate = new Date();
  currDate = new Date(currDate.toISOString().split("T")[0]);

  const attendances = await Attendance.find({ date: currDate, grade, section });

  if (attendances.length > 0) {
    res.json({ error: "Attendance already taken" });
  } else {
    next();
  }
};

const handleAttendancePost = async (req, res) => {
  try {
    const { grade, section } = req.body;
    let attendanceData = JSON.parse(req.body.attendanceData);
    // console.log(attendanceData);

    let currDate = new Date();
    currDate = new Date(currDate.toISOString().split("T")[0]);
    const attendances = attendanceData.map((aData) => ({
      date: currDate,
      grade,
      section,
      registrationNumber: aData.registrationNumber,
      studentName: aData.studentName,
      present: aData.present,
    }));
    const result = await Attendance.insertMany(attendances);
    res.json({ msg: "Successful", result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "INVALID ATTENDANCE" });
  }
};

const handleAttendanceView = async (req, res) => {
  // console.log(req.body);
  const { startDate, endDate, grade, section } = req.body;
  // console.log(new Date(startDate));
  const result = await Attendance.find({
    grade,
    section,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });
  res.json(result);
};

const createAttendance = async (req, res) => {
  try {
    const newAttendance = Attendance(req.body);
    const data = await newAttendance.save();
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const attendance = await Attendance.findById(attendanceId);
    res.json({ data: attendance });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      req.body,
      { new: true }
    );
    res.json({ data: attendance });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    await Attendance.findByIdAndRemove(attendanceId);
    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  findGradeStudents,
  checkDuplicate,
  handleAttendancePost,
  handleAttendanceView,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
