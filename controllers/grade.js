const Grade = require("../models/grade");

const sumFees = (req, res, next) => {
  try {
    let totalFixedFees = 0;
    totalFixedFees += parseInt(req.body["admissionFees"]);
    totalFixedFees += parseInt(req.body["tutionFees"]);
    totalFixedFees += parseInt(req.body["latePaymentFine"]);
    totalFixedFees += parseInt(req.body["furnitureFees"]);
    totalFixedFees += parseInt(req.body["conveyanceCharges"]);
    totalFixedFees += parseInt(req.body["examFees"]);
    totalFixedFees += parseInt(req.body["developmentFees"]);
    totalFixedFees += parseInt(req.body["computerFees"]);
    req.body["totalFixedFees"] = totalFixedFees;
    next();
  } catch (error) {
    console.log(error);
    console.log("FEES SUM FINDING ERROR");
    res.status(500);
  }
};

const createGrade = async (req, res) => {
  // VALIDATE THE BODY
  req.body.sections = [];
  req.body.studentCnt = 0;
  // console.log(req.body);
  const newGrade = Grade(req.body);
  try {
    const createdGrade = await newGrade.save();
    res.json(createdGrade);
  } catch (error) {
    console.log(error);
    console.log("GRADE CREATION ERROR");
    res.status(500).send("GRADE CREATION ERROR");
  }
};

const getAllGrades = async (req, res) => {
  const grades = await Grade.find();
  // res.render("allGrades", { grades });
  // console.log(grades);
  res.json(grades);
};

const getGrade = async (req, res) => {
  const { gradeName } = req.params;
  try {
    const grade = await Grade.findOne({ gradeName });
    if (grade) {
      // res.render("gradeInfo", { grade });
      res.json(grade);
    } else {
      res.status(400).send(`Invalid grade Name: ${gradeName}`);
    }
  } catch (error) {
    console.log(error);
    console.log("GRADE FETCHING ERROR");
    res.status(500).send(error);
  }
};

const updateGrade = async (req, res) => {
  const { gradeName } = req.params;

  try {
    const updatedGrade = await Grade.findOneAndUpdate({ gradeName }, req.body, {
      new: true,
    });
    if (updatedGrade) {
      // res.json(updatedGrade);
      res.redirect(`/grade/${gradeName}`);
    } else {
      res.status(400).send(`Invalid Grade Name: ${gradeName}`);
    }
  } catch (error) {
    console.log(error);
    console.log("GRADE UPDATION ERROR");
    res.status(500).send(error);
  }
};

const getGradeById = async (req, res) => {
  try {
    const { gradeId } = req.params;
    const grade = await Grade.findById(gradeId);
    res.json({ grade });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const updateGradeById = async (req, res) => {
  try {
    const { gradeId } = req.params;
    const updatedGrade = await Grade.findByIdAndUpdate(gradeId, req.body, {
      new: true,
    });
    res.json({ grade: updatedGrade });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const deleteGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;
    await Grade.findByIdAndRemove(gradeId);
    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  sumFees,
  createGrade,
  getAllGrades,
  getGrade,
  updateGrade,
  getGradeById,
  updateGradeById,
  deleteGrade,
};
