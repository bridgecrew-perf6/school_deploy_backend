const { Router } = require("express");
const { isSignedIn } = require("../controllers/auth");
const {
  updateStudent,
  generateRegistrationNum,
  uploadStudentInfo,
  validateStudent,
  createStudent,
  getAllStudents,
  populateRegistrationNumInReq,
  admissionPreprocess,
  getStudent,
} = require("../controllers/student");

const router = Router();

router
  .route("/admitStudent")
  .post(
    isSignedIn,
    generateRegistrationNum,
    uploadStudentInfo,
    admissionPreprocess,
    validateStudent,
    createStudent
  );

router.route("/allStudents").get(isSignedIn, getAllStudents);

router
  .route("/student/:registrationNumber")
  .get(isSignedIn, getStudent)
  .post(
    isSignedIn,
    populateRegistrationNumInReq,
    uploadStudentInfo,
    updateStudent
  );

module.exports = router;
