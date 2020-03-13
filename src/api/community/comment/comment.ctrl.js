const models = require('../../../models');
const colorConsole = require('../../../lib/log');

exports.writeComment = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    const commentData = {
      ...body,
      memberId,
    };

    await models.PostComment.create(commentData);

    const result = {
      status: 200,
      message: '댓글 작성 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.getComments = async (req, res) => {
  const { idx } = req.query;

  if (!idx) {
    const result = {
      status: 400,
      message: 'idx를 지정해주세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const comments = await models.PostComment.getCommentsByPostIdx(idx);

    const result = {
      status: 200,
      message: '댓글 조회 성공!',
      data: {
        comments,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.updateComment = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    const comment = await models.PostComment.getCommentByIdx(body.idx, memberId);

    if (!comment) {
      const result = {
        status: 403,
        message: '댓글이 수정 권한 없음!',
      };

      res.status(403).json(result);

      return;
    }

    await models.PostComment.update({
      comment: body.comment,
      isUpdate: 1,
    }, {
      where: {
        idx: body.idx,
      },
    });

    const result = {
      status: 200,
      message: '댓글 수정 성공!',
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

exports.deleteComment = async (req, res) => {
  const { idx } = req.query;
  const { auth, memberId } = req.decoded;

  try {
    const comment = await models.PostComment.getCommentByIdx(idx, memberId);

    if (auth === 0) {
      await models.PostComment.destroy({
        where: {
          idx,
        },
      });

      const result = {
        status: 200,
        message: '관리자  권한으로 댓글 삭제 성공!',
      };

      res.status(200).json(result);

      return;
    }

    if (!comment) {
      const result = {
        status: 403,
        message: '댓글 삭제 권한 없음!',
      };

      res.status(403).json(result);

      return;
    }

    await models.PostComment.destroy({
      where: {
        idx,
      },
    });

    const result = {
      status: 200,
      message: '댓글 삭제 성공!',
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
