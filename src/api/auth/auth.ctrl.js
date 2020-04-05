/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const verifier = require('email-verify');
const crypto = require('crypto');
const log = require('../../lib/log');
const models = require('../../models');
const tokenLib = require('../../lib/token');
const validate = require('../../lib/Validate/member');
const emailLib = require('../../lib/email');

const { EMAIL_CODE_SECRET: emailSecret } = process.env;
let emailSecretCode = null;

exports.login = async (req, res) => {
  const { id, pw } = req.body;

  if (!id) {
    const result = {
      status: 400,
      message: 'id를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }
  if (!pw) {
    const result = {
      status: 400,
      message: 'pw를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberForLogin(id, pw);

    if (!member) {
      const result = {
        status: 403,
        message: 'id 혹은 pw가 잘못 되었습니다!',
      };

      res.status(403).json(result);

      return;
    }

    const token = await tokenLib.createToken(member.memberId, member.auth);
    const refreshToken = await tokenLib.createRefreshToken(member.memberId, member.auth);

    const result = {
      status: 200,
      message: '로그인 성공!',
      data: {
        token,
        refreshToken,
        member,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.registerAccount = async (req, res) => {
  const { body } = req;
  const requestAddress = req.get('host');

  try {
    await validate.validateRegisterUser(body);
  } catch (error) {
    log.error(error);

    const result = {
      status: 400,
      message: '회원가입 양식을 확인 해주세요!',
    };

    res.status(400).json(result);

    return;
  }

  if (body.certification === false) {
    const result = {
      status: 403,
      message: '이메일 검증이 필요합니다.',
    };

    res.status(403).json(result);

    return;
  }

  if (body.consent === false) {
    const result = {
      status: 403,
      message: '개인정보 동의를 해주세요!',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const memberId = await models.Member.findRegisterMemberId(body.memberId);

    if (memberId) {
      const result = {
        status: 409,
        message: '이미 회원가입이 된 id입니다!',
      };

      res.status(409).json(result);

      return;
    }

    if (body.profileImage !== null) {
      body.profileImage = `https://${requestAddress}/image/${body.profileImage.type}/${body.profileImage.uploadName}`;
    }

    await models.Member.registerMember(body.memberId, body.pw, 1, body.name, body.certification, body.profileImage, body.email, body.nickName, body.consent);

    const result = {
      status: 200,
      message: '회원가입 성공!',
      body,
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.findId = async (req, res) => {
  const { body } = req;

  try {
    await validate.validateUserEmail(body);
  } catch (error) {
    log.error(error);

    const result = {
      status: 400,
      message: '이메일 검증 에러!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberByEmail(body.email);

    if (!member) {
      const result = {
        status: 403,
        message: '해당 이메일로 가입된 데이터가 없습니다!',
      };

      res.status(403).json(result);

      return;
    }

    await emailLib.sendEmailUserId(body.email, member.memberId);

    const result = {
      status: 200,
      message: '사용자 id 정보 이메일 보내기 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.findPw = async (req, res) => {
  const { body } = req;

  try {
    await validate.validateUserEmail(body);
  } catch (error) {
    log.error(error);

    const result = {
      status: 400,
      message: 'email 검증 오류!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberByEmail(body.email);

    if (!member) {
      const result = {
        status: 403,
        message: '해당 이메일로 가입된 데이터가 없습니다!',
      };

      res.status(403).json(result);

      return;
    }


  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.emailVerify = async (req, res) => {
  const { email } = req.body;
  let verifyEmail = null;

  if (!email) {
    const result = {
      status: 400,
      message: '이메일을 입력해주세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise(async (resolve, reject) => {
      await verifier.verify(email, (error, info) => {
        resolve(info.success);
      });
    });

    verifyEmail = await promise;

    if (verifyEmail === false) {
      const result = {
        status: 403,
        message: '유효하지 않은 이메일 입니다!',
      };

      res.status(403).json(result);

      return;
    }
    const emailData = await models.Member.findMemberByEmail(email);
    if (emailData) {
      const result = {
        status: 400,
        message: '이미 회원가입 처리된 이메일 입니다!',
      };

      res.status(400).json(result);

      return;
    }

    let emailCode = await emailLib.createEmailCode();
    emailCode = String(emailCode);

    await emailLib.sendEmailCode(email, emailCode);

    emailSecretCode = crypto.createHash('sha256').update(String(emailSecret)).digest('base64').substr(0, 32);

    const iv = crypto.randomBytes(16); // 암호화 길이 설정 aes-256-ctr의 경우 길이 16이여야 함
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(emailSecretCode), iv);
    const encrypted = cipher.update(emailCode);

    const cipherCode = `${iv.toString('hex')}:${encrypted.toString('hex')}`;

    const result = {
      status: 200,
      message: '이메일 코드 보내기 성공!',
      cipherCode,
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.checkMemberId = async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    const result = {
      status: 400,
      message: 'memberId값을 입력 하세요',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findRegisterMemberId(memberId);

    if (member) {
      const result = {
        status: 400,
        message: '이미 사용중인 memberId!',
      };

      res.status(400).json(result);

      return;
    }

    const result = {
      status: 200,
      message: '사용 가능한 memberId!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
