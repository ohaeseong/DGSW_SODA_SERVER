const models = require('../../models');
const colorConsole = require('../../lib/log');
const validate = require('../../lib/Validate/bamboo');
const file = require('../../lib/file');
const { asyncForeach } = require('../../lib/method');

exports.writePost = async (req, res) => {
  const { body } = req;
  const requestAddress = req.get('host');

  try {
    await validate.validateWriteBamboo(body);
  } catch (error) {
    colorConsole.warn(error);

    const result = {
      status: 400,
      message: '게시물 양식을 확인 하세요!',
    };

    res.status(400).json(result);

    return;
  }

  const addData = {
    ...body,
  };

  try {
    // 게시물 DB저장 (이미지 O)
    if (addData.picture !== null && Array.isArray(addData.picture)) {
      const { picture } = addData;

      // 파일 검증
      try {
        await validate.validateBambooFile(body.picture[0]);
      } catch (error) {
        colorConsole.warn(error);

        const result = {
          status: 400,
          message: '파일 검증 오류!',
        };

        res.status(400).json(result);

        return;
      }

      // DB 저장 (게시물)
      const bambooData = await models.Bamboo.create(addData);

      // IMAGE URL 발급
      await file.creatImageUrlDB(picture, requestAddress, bambooData.idx);

      const result = {
        status: 200,
        message: '게시물 저장 성공! (pitcure !== null)',
        addData,
      };

      res.status(200).json(result);
    } else {
      // 게시물 DB저장 (이미지 X)
      await models.Bamboo.create({
        ...body,
      });

      colorConsole.green('[BAMBOO] 게시물 작성 API 호출');

      const result = {
        status: 200,
        message: '게시물 저장 성공! (pitcure === null)',
        addData,
      };

      res.status(200).json(result);
    }
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.getAllowPost = async (req, res) => {
  const requestAddress = req.get('host');

  try {
    const bamboo = await models.Bamboo.getIsAllowBamboo(1);
    // const comment = await models.PostCommen.getAllComment();

    await asyncForeach(bamboo, async (value) => {
      const { idx } = value;
      // value.comment = [];

      const fileData = await models.BambooFile.getFiles(idx);

      await file.creatImageUrl(fileData, requestAddress);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
      // 게시물 댓글 정보 추가
      // eslint-disable-next-line no-plusplus
      // for (let i = 0; i < comment.length; i++) {
      //  if (comment[i].postIdx === idx) {
      //  value.comment.push(comment[i]);

      // if (value.comment.length > 2) {
      //  return;
      // }
      // }
    // }
    });

    const result = {
      status: 200,
      message: '승인 된 게시물 조회 성공!',
      data: {
        bamboo,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
