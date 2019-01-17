const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const {messages} = require('./../../constants')

module.exports = {
  getMessages: {
      params: {
        collabId: Joi.objectId().required()
      },
      query: {
          unread: Joi.boolean().allow(null),
          direction: Joi.string().valid([messages.RECEIVED, messages.SENT]).allow(null)
      }
  }
}
