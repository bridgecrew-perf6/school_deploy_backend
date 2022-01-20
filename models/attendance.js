const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  present: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
