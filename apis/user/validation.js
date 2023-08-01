const Joi = require('joi');

const validateUser = user => {
    // console.log("User for validation", user)
  const schema = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    photo: Joi.string()
  });

  return schema.validate(user);
};

module.exports.validate = validateUser;