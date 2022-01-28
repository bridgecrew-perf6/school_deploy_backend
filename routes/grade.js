const { Router } = require("express");

const { isSignedIn } = require("../controllers/auth.js");
const { uploadS3 } = require("../controllers/aws_s3.js");
const {
  sumFees,
  createGrade,
  getAllGrades,
  getGrade,
  updateGrade,
  deleteGrade,
} = require("../controllers/grade.js");

const router = Router();

router
  .route("/createGrade")
  .post(isSignedIn, uploadS3.none(), sumFees, createGrade);

router.route("/allGrades").get(isSignedIn, getAllGrades);

router
  .route("/grade/:gradeName")
  .get(isSignedIn, getGrade)
  .post(isSignedIn, uploadS3.none(), sumFees, updateGrade);

router.route("/grade/delete/:gradeId").delete(deleteGrade);

module.exports = router;
