const Joi = require('joi')

module.exports = {
  performerPrestations: {
    isFavorite: Joi.boolean().allow(null).default(false)
  }
}
