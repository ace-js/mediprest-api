const Joi = require('joi')

module.exports = {
  credentials: {
    username: Joi.string().required(),
    password: Joi.string().required()
  },
  collaborator: {
    firstname: Joi.string().required().min(2).max(60),
    name: Joi.string().required().min(2).max(60),
    username: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.array().required().min(1),
    department: Joi.string().required(),
    performers: Joi.array().allow(null)
  }
}
