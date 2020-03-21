const { asyncForeach } = require('../lib/method');
const models = require('../models');

// url 작성 및 DB저장
exports.bambooCreatImageUrlDB = async (picture, requestAddress, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      bambooIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.BambooFile.create(fileData);

    const fileType = fileData.type;

    const { uploadName } = fileData;

    // url 만들기
    // if (fileType.startsWith('.')) {
    //   fileType = fileType.substring('1', fileType.length);
    // }
    // if (fileType === 'jpg') {
    //   fileType = 'jpeg';
    // }

    const url = `https://${requestAddress}/image/${fileType}/${uploadName}`;

    value.url = url;
    value.type = fileType;
  });
};

exports.sodaPostCreatImageUrlDB = async (picture, requestAddress, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      sodaIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.SodaFile.create(fileData);

    const fileType = fileData.type;

    const { uploadName } = fileData;

    const url = `https://${requestAddress}/image/${fileType}/${uploadName}.${fileType}`;

    value.url = url;
    value.type = fileType;
  });
};

exports.creatImageUrl = async (picture, requestAddress) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      ...value,
    };

    const fileType = fileData.type;

    const { uploadName } = fileData;

    // url 만들기
    // if (fileType.startsWith('.')) {
    //   fileType = fileType.substring('1', fileType.length);
    // }
    // if (fileType === 'jpg') {
    //   fileType = 'jpeg';
    // }

    const url = `https://${requestAddress}/image/${fileType}/${uploadName}.${fileType}`;

    value.url = url;
    value.type = fileType;
  });
};
