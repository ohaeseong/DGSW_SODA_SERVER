const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateRegisterUser = async (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    pw: Joi.string().required(),
    name: Joi.string().required(),
    certification: Joi.boolean().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};
