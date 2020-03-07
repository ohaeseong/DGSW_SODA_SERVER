const { asyncForeach } = require('../lib/method');
const models = require('../models');

// url 작성 및 DB저장
exports.creatImageUrlDB = async (picture, requestAddress, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      bambooIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.BambooFile.create(fileData);

    let fileType = fileData.type;

    const { uploadName } = fileData;

    // url 만들기
    if (fileType.startsWith('.')) {
      fileType = fileType.substring('1', fileType.length);
    }
    if (fileType === 'jpg') {
      fileType = 'jpeg';
    }

    const url = `http://${requestAddress}/image/${fileType}/${uploadName}`;

    value.url = url;
    value.type = fileType;
  });
};

exports.creatImageUrl = async (picture, requestAddress) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      ...value,
    };

    let fileType = fileData.type;

    const { uploadName } = fileData;

    // url 만들기
    if (fileType.startsWith('.')) {
      fileType = fileType.substring('1', fileType.length);
    }
    if (fileType === 'jpg') {
      fileType = 'jpeg';
    }

    const url = `http://${requestAddress}/image/${fileType}/${uploadName}`;

    value.url = url;
    value.type = fileType;
  });
};
