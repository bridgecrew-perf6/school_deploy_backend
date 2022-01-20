const mongoose = require("mongoose");
const {
  NATIONALITY,
  RELIGIONS,
  SEX,
  BLOODGROUPS,
  FEESCHEMES,
} = require("../constants");

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  permanentAddr: {
    type: String,
    required: true,
  },
  presentAddr: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    enum: RELIGIONS,
    default: RELIGIONS[0],
  },
  sex: {
    type: String,
    enum: SEX,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  DOA: {
    type: Date,
    default: Date.now(),
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  nationality: {
    type: String,
    enum: NATIONALITY,
    default: NATIONALITY[0],
  },
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  transportChosen: {
    type: Boolean,
    required: true,
  },
  houseDistance: {
    type: Number,
    required: true,
  },
  feesPaid: {
    type: Number,
    required: true,
  },
  feesTotal: {
    type: Number,
    required: true,
  },
  feeScheme: {
    type: String,
    enum: FEESCHEMES,
    required: true,
  },
  discountPercent: {
    type: Number,
    enum: [0.15, 0.1, 0.5, 0],
    required: true,
  },
  fatherQualification: {
    type: String,
    default: "NA",
  },
  fatherProfession: {
    type: String,
    default: "NA",
  },
  fatherPhoto: {
    type: String,
    default: "NA",
  },
  fatherAadhar: {
    type: String,
    default: "NA",
  },
  motherQualification: {
    type: String,
    default: "NA",
  },
  motherProfession: {
    type: String,
    default: "NA",
  },
  motherPhoto: {
    type: String,
    default: "NA",
  },
  motherAadhaar: {
    type: String,
    default: "NA",
  },
  marriageAnniversary: {
    type: Date,
    default: new Date(0),
  },
  childAadhaar: {
    type: String,
    default: "NA",
  },
  childPhoto: {
    type: String,
    default: "NA",
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: BLOODGROUPS,
    default: BLOODGROUPS[0],
  },
  previousSchool: {
    type: String,
    default: "NA",
  },
  termCert: {
    type: String,
    default: "NA",
  },
  charCert: {
    type: String,
    default: "NA",
  },
});

module.exports = mongoose.model("Student", studentSchema);
