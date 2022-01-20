const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  gradeName: {
    type: String,
    required: true,
    unique: true,
  },
  maxSectionSize: {
    type: Number,
    required: true,
  },
  studentCnt: {
    type: Number,
    required: true,
  },
  sections: {
    type: Array(String),
    default: [],
  },
  admissionFees: {
    type: Number,
    required: true,
  },
  tutionFees: {
    type: Number,
    required: true,
  },
  latePaymentFine: {
    type: Number,
    required: true,
  },
  furnitureFees: {
    type: Number,
    required: true,
  },
  conveyanceCharges: {
    type: Number,
    required: true,
  },
  examFees: {
    type: Number,
    required: true,
  },
  developmentFees: {
    type: Number,
    required: true,
  },
  computerFees: {
    type: Number,
    required: true,
  },
  totalFixedFees: {
    type: Number,
    required: true,
  },
  baseTransportFee: {
    type: Number,
    required: true,
  },
  baseDist: {
    type: Number,
    required: true,
  },
  offsetTransportFee: {
    type: Number,
    required: true,
  },
  offsetDist: {
    type: Number,
    required: true,
  },
  fixedMonthlyFee: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Grade", gradeSchema);
