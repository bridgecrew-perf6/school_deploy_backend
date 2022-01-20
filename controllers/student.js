const Grade = require("../models/grade.js");
const Student = require("../models/student.js");
const { uploadS3 } = require("./aws_s3.js");

exports.updateGradeInfo = async (grade) => {
  // it updates student cnt by 1, adds a new section if required
  try {
    grade["studentCnt"] = grade["studentCnt"] + 1;
    const sectionSize = grade["maxSectionSize"];
    const studentCnt = grade["studentCnt"];
    if (studentCnt % sectionSize == 1) {
      const sectionName = `${Math.ceil(studentCnt / sectionSize)}`;
      grade["sections"].push(sectionName);
    }

    let updatedGrade = await Grade.findByIdAndUpdate(grade["_id"], grade);
    // console.log(updatedGrade);
    return updatedGrade;
  } catch (error) {
    const err_msg = "GRADE UPDATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

exports.populateSectionRollFees = (req, grade) => {
  try {
    // console.log(grade);
    const sectionSize = grade["maxSectionSize"];
    const studentCnt = grade["studentCnt"] + 1;
    // console.log(sectionSize, studentCnt);
    const sectionName = `${Math.ceil(studentCnt / sectionSize)}`;
    // console.log(studentCnt);

    // CAL TOTAL FEES INCLUDING TRANSPORT FEES IF IT IS OPTED
    let transportFees = 0;
    if (req.body.transportChosen) {
      const { baseTransportFee, baseDist, offsetTransportFee, offsetDist } =
        grade;
      let { houseDistance } = req.body;
      transportFees = baseTransportFee;
      houseDistance -= baseDist;
      if (houseDistance > 0) {
        transportFees +=
          Math.floor(houseDistance / offsetDist) * offsetTransportFee;
      }
    }

    req.body["roll"] = studentCnt;
    req.body["section"] = sectionName;
    req.body["feesTotal"] = grade["totalFixedFees"] + transportFees;

    const { feeScheme } = req.body;
    const { fixedMonthlyFee } = grade;

    // Fees for other feeScheme
    if (feeScheme == "OTHER") {
      req.body["feesTotal"] = fixedMonthlyFee * 12;
    }

    schemeDiscountPercent = {
      "1TIMEPAY": 0.15,
      "2TIMEPAY": 0.1,
      "3TIMEPAY": 0.05,
      OTHER: 0.0,
    };

    // POPULATING DISCOUNT PERCENT
    req.body["discountPercent"] = schemeDiscountPercent[feeScheme];

    // CAL DISCOUNT PERCENT FOR FEES
    req.body["feesTotal"] -=
      req.body["feesTotal"] * schemeDiscountPercent[feeScheme];

    req.body["feesPaid"] = 0;
  } catch (error) {
    console.log(error);
    const err_msg = "ROLL NUM AND SECTION POPULATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

exports.generateRegistrationNum = (req, res, next) => {
  try {
    // const dt = new Date();
    // const gradeName = parseInt(grade["gradeName"]).toLocaleString("en-IN", {
    //   minimumIntegerDigits: 2,
    // });
    // const studentCnt = (grade["studentCnt"] + 1).toLocaleString("en-IN", {
    //   minimumIntegerDigits: 3,
    // });
    // req.body["registrationNumber"] = dt.getFullYear() + gradeName + studentCnt;
    req["registrationNumber"] = Date.now();
    next();
  } catch (error) {
    const err_msg = "REGISTRATION NUMBER POPULATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

exports.admissionPreprocess = async (req, res, next) => {
  // console.log(req.body);
  const grade = req.body["grade"];
  try {
    let readGrade = await Grade.findOne({ gradeName: grade });
    req.body.readGrade = readGrade;
    // console.log(readGrade);
    if (readGrade) {
      req.body["registrationNumber"] = req.registrationNumber;
      req.body["transportChosen"] = req.body["transportChosen"] ? true : false;
      populateSectionRollFees(req, readGrade);
      next();
    } else {
      res.status(400).send("INVALID GRADE NAME");
    }
  } catch (error) {
    const err_msg = "ADMISSION PREPROCESS ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

exports.populateRegistrationNumInReq = (req, res, next) => {
  // console.log(req.body);
  req.registrationNumber = req.params["registrationNumber"];
  next();
};

exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  // res.render("allStudents", { students });
  res.json(students);
};

exports.getStudent = async (req, res) => {
  const { registrationNumber } = req.params;
  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      // const grades = await Grade.find();
      // res.render("studentInfo", { student, grades });
      res.json(student);
    } else {
      res
        .status(400)
        .send(`Invalid Registration Number: ${registrationNumber}`);
    }
  } catch (error) {
    console.log(error);
    console.log("STUDENT FETCHING ERROR");
    res.status(500).send(error);
  }
};

exports.createStudent = async (req, res) => {
  // console.log(typeof req.files);

  // populating paths of images
  for (const fieldName in req.files) {
    const file = req.files[fieldName][0];
    req.body[fieldName] = file.location;
  }
  // console.log(req.body);
  let readGrade = req.body["readGrade"];
  delete req.body["readGrade"];

  try {
    const newStudent = new Student(req.body);
    const admittedStudent = await newStudent.save();

    readGrade = await updateGradeInfo(readGrade);

    res.json(admittedStudent);
  } catch (error) {
    console.log(error);
    console.log("STUDENT ADMISSION ERROR");
    res.status(500).send(error);
  }
};

exports.updateStudent = async (req, res) => {
  // res.send("ok");
  const { registrationNumber } = req.params;

  // console.log(req.body);

  // INCASE IMAGE FIELDS ARE NOT POPULATED THE VALUE IS EMPTY STRING,
  // SO WE SHOULD NOT UPDATE THE PREVIOUS VALUE
  const imageFields = [
    "fatherPhoto",
    "motherPhoto",
    "childPhoto",
    "termCert",
    "charCert",
  ];

  for (let field of imageFields) {
    // console.log(field, req.files[field]);
    if (req.files[field]) {
      req.body[field] = req.files[field][0]["location"];
    }
  }

  // res.send("ok");

  // console.log(req.body);

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { registrationNumber },
      req.body,
      { new: true }
    );
    if (updatedStudent) {
      res.json(updatedStudent);
    } else {
      res
        .status(400)
        .send(`Invalid Registration Number: ${registrationNumber}`);
    }
  } catch (error) {
    console.log(error);
    console.log("STUDENT UPDATION ERROR");
    res.status(500).send(error);
  }
};

exports.validateStudent = (req, res, next) => {
  const studentValidationSchema = Joi.object({
    studentName: Joi.string().min(3).max(30).required(),
    fatherName: Joi.string().min(3).max(30).required(),
    motherName: Joi.string().min(3).max(30).required(),
    permanentAddr: Joi.string().min(10).max(100).required(),
    presentAddr: Joi.string().min(10).max(100).required(),
    religion: Joi.string()
      .valid(...RELIGIONS)
      .required(),
    sex: Joi.string()
      .valid(...SEX)
      .required(),
    DOB: Joi.date().iso().required(),
    registrationNumber: Joi.number().required(),
    nationality: Joi.string()
      .valid(...NATIONALITY)
      .required(),
    readGrade: Joi.object(),
    grade: Joi.string().required(),
    section: Joi.string().required(),
    roll: Joi.number().required(),
    mobileNumber: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
    transportChosen: Joi.boolean().required(),
    houseDistance: Joi.number().required(),
    feesPaid: Joi.number().required(),
    feesTotal: Joi.number().required(),
    feeScheme: Joi.string()
      .valid(...FEESCHEMES)
      .required(),
    discountPercent: Joi.number().required(),
    fatherQualification: Joi.string().required(),
    fatherProfession: Joi.string().required(),
    fatherPhoto: Joi.string(),
    fatherAadhar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    motherQualification: Joi.string().required(),
    motherProfession: Joi.string().required(),
    motherPhoto: Joi.string(),
    motherAadhaar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    marriageAnniversary: Joi.date().iso().required(),
    childAadhaar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    childPhoto: Joi.string(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    bloodGroup: Joi.string()
      .valid(...BLOODGROUPS)
      .required(),
    termCert: Joi.string(),
    charCert: Joi.string(),
  });
  const values = studentValidationSchema.validate(req.body);
  if (values.error) {
    res.status(400).json({ error: values.error.details });
  } else {
    next();
  }
};

exports.getGradeSectionStudents = async (req, res) => {
  // VALIDATION of params using regex is left
  const { grade, section } = req.params;
  // console.log(grade, section);
  const students = await Student.find({ grade, section });
  res.json(students);
};

exports.uploadStudentInfo = uploadS3.fields([
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "childPhoto", maxCount: 1 },
  { name: "charCert", maxCount: 1 },
  { name: "termCert", maxCount: 1 },
]);

exports.createStudentDirect = async (req, res) => {
  try {
    const newStudent = Student(req.body);
    const student = await newStudent.save();
    res.json({ student });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    res.json({ student });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.updateStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true }
    );
    res.json({ student: updatedStudent });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    await Student.findByIdAndRemove(studentId);
    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
