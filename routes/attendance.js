const {
  findGradeStudents,
  handleAttendancePost,
  handleAttendanceView,
  checkDuplicate,
} = require("../controllers/attendance");
const { Router } = require("express");
const { isSignedIn } = require("../controllers/auth");
const { uploadS3 } = require("../controllers/aws_s3");
const router = Router();

router
  .route("/attendance")
  .get(isSignedIn, findGradeStudents)
  .post(isSignedIn, uploadS3.none(), checkDuplicate, handleAttendancePost);

router.route("/attendanceView").post(uploadS3.none(), handleAttendanceView);

module.exports = router;
