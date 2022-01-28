const {
  isSignedIn,
  handleSignup,
  handleSignin,
  handleSignout,
} = require("../controllers/auth");

const { Router } = require("express");
const router = Router();

const {
  getAllTeachers,
  populateTeacherRole,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { uploadS3 } = require("../controllers/aws_s3");

router.route("/allTeachers").get(isSignedIn, getAllTeachers);

router
  .route("/hireTeacher")
  .post(isSignedIn, uploadS3.none(), populateTeacherRole, handleSignup);

router.route("/signin").post(uploadS3.none(), handleSignin);

router.route("/signout").get(handleSignout);

router
  .route("/teacher/:userId")
  .get(isSignedIn, getUserById)
  .post(isSignedIn, uploadS3.none(), updateUser)
  .delete(isSignedIn, deleteUser);

module.exports = router;
