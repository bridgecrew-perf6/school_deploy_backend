const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// S3 BUCKET SETUP
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: process.env.AWS_REGION,
});

// MULTER MIDDLEWARE CONFIGURATION
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      // console.log(file);
      try {
        const uniqueSuffix = req.registrationNumber;
        const fileExtension = file.originalname.split(".")[1];
        const mainFile = file.fieldname.toUpperCase();
        // console.log(mainFile);
        cb(null, mainFile + "_" + uniqueSuffix + "." + fileExtension);
      } catch (error) {
        const err_msg = "S3 UPLOAD FILE RENAMING ERROR";
        console.log(err_msg);
        throw err_msg;
      }
    },
  }),
});

module.exports = {
  s3,
  uploadS3,
};
