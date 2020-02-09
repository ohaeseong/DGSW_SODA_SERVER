const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
// const {
//   accessKeyId,
//   secretAccessKey,
//   region,
// } = require('../../config/aws.json');

/* aws s3 업로드 */
// const s3 = new aws.S3({
//   accessKeyId,
//   secretAccessKey,
//   region,
// });

// exports.uploadImgS3 = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'ano-community',
//     acl: 'public-read',
//     key: (req, file, cb) => {
//       console.log(`${uuid()}${path.extname(file.originalname)}`);
//       cb(null, `${uuid()}${path.extname(file.originalname)}`);
//     },
//   }),
//   limits: {
//     fileSize: 5000000,
//   },
// });

/* 로컬 업로드 */
exports.uploadImgLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const filePath = `public/${path.extname(file.originalname).slice(1)}`;

      // eslint-disable-next-line no-unused-expressions
      !fs.existsSync(filePath) && fs.mkdirSync(filePath);
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      console.log(path.extname(file.originalname).slice(1));
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
}).array('img');
