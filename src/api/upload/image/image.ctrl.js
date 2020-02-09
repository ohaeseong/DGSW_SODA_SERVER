const log = require('../../../lib/log');

exports.uploadImgs = (req, res) => {
  const imgs = [];

  req.files.forEach((file) => {
    imgs.push(file.filename);
  });

  const result = {
    status: 200,
    message: '이미지 업로드 성공',
    data: {
      imgs,
    },
  };
  res.status(200).json(result);

  log.green('이미지 업로드 성공');
};
