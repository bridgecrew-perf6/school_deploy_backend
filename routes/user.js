const {
  isSignedIn,
  handleSignup,
  handleSignin,
  handleSignout,
} = require("../controllers/auth");

const { Router } = require("express");
const router = Router();

const { getAllTeachers, populateTeacherRole } = require("../controllers/user");
const { uploadS3 } = require("../controllers/aws_s3");

router.route("/allTeachers").get(isSignedIn, getAllTeachers);

router
  .route("/hireTeacher")
  .post(uploadS3.none(), populateTeacherRole, handleSignup);

router.route("/signin").post(uploadS3.none(), handleSignin);

router.route("/signout").get(handleSignout);

module.exports = router;
