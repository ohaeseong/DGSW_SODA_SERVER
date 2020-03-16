const models = require('../../../models');
const colorConsole = require('../../../lib/log');

exports.isLike = async (req, res) => {
  const { memberId } = req.decoded;
  const { body } = req;

  try {
    const { idx } = body;

    if (!idx) {
      const result = {
        status: 400,
        message: 'idx를 전송하세요!',
      };

      res.status(400).json(result);
      return;
    }

    const likeData = await models.SodaPostLike.getPostLike(idx, memberId);
    if (!likeData) {
      await models.SodaPostLike.createPostLike(idx, memberId, 1);

      const result = {
        status: 200,
        message: '첫 좋아요 추가 성공!',
        data: {
          idx,
        },
      };

      res.status(200).json(result);
      return;
    }
    if (likeData && likeData.isLike === 1) {
      await models.SodaPostLike.update({
        isLike: 0,
      }, {
        where: {
          sodaIdx: idx,
          memberId,
        },
      });

      const result = {
        status: 200,
        message: '싫어요 상태 성공!',
        data: {
          idx,
        },
      };

      res.status(200).json(result);
      return;
    } if (likeData && likeData.isLike === 0) {
      await models.SodaPostLike.update({
        isLike: 1,
      }, {
        where: {
          sodaIdx: idx,
          memberId,
        },
      });

      const result = {
        status: 200,
        message: '좋아요 상태 성공!',
        data: {
          idx,
        },
      };

      res.status(200).json(result);
    }
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};
