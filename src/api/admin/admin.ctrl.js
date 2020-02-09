const models = require('../../models');
const FB = require('../../repo/facebook');
const colorConsole = require('../../lib/log');
const file = require('../../lib/file');
const { asyncForeach } = require('../../lib/method');

exports.isAllowPost = async (req, res) => {
  const { isAllow, idx } = req.body;
  const { auth } = req.decoded;
  const requestAddress = req.get('host');

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    // 게시물 거절
    if (isAllow === 0) {
      await models.Post.destroy({
        where: {
          idx,
        },
      });

      const result = {
        status: 200,
        message: '게시물 거절 성공!',
      };

      res.status(200).json(result);

      return;
    }

    // 게시물 수락 및 페이스북 페이지 업로드
    const post = await models.Post.getByIdx(idx);
    const postFile = await models.PostFile.getFiles(post.idx);

    if (postFile[0] !== undefined) {
      const imageFile = [];

      // 첨부할 이미지 url 만들기
      await file.creatImageUrl(postFile, requestAddress);

      postFile.forEach((value) => {
        imageFile.push(value.url);
      });

      // 게시물 페이스북 업로드
      const errorCode = await FB.uploadPostWithPhoto(imageFile, post.contents);

      if (errorCode === 'error') {
        const result = {
          status: 500,
          message: '파일 첨부 중 에러!',
        };

        res.status(500).json(result);

        return;
      }

      await models.Post.update({
        isAllow: 1,
        allowDate: Date.now(),
      }, {
        where: {
          idx: post.idx,
        },
      });

      const result = {
        status: 200,
        message: '게시물 수락 성공! (이미지 첨부)',
      };

      res.status(200).json(result);

      return;
    }

    await models.Post.update({
      isAllow: 1,
      allowDate: Date.now(),
    }, {
      where: {
        idx: post.idx,
      },
    });

    await FB.uploadPostWithOutPhoto(post.contents);

    const result = {
      status: 200,
      message: '게시물 수락 성공!',
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

exports.getNotAllowPost = async (req, res) => {
  const { auth } = req.decoded;
  const requestAddress = req.get('host');

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const post = await models.Post.getisAllowPost(0);
    await asyncForeach(post, async (value) => {
      const { idx } = value;

      const fileData = await models.PostFile.getFiles(idx);

      await file.creatImageUrl(fileData, requestAddress);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });
    const result = {
      status: 200,
      message: '승인 되지 않은 게시물 조회 성공!',
      data: {
        post,
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

exports.deletePost = async (req, res) => {
  const { idx } = req.query;
  const { auth } = req.decoded;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    await models.Post.destroy({
      where: { idx },
    });

    const result = {
      status: 200,
      message: '게시물 삭제 성공!',
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
