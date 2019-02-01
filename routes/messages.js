const { filter, isNull, get, isUndefined } = require('lodash')
const Joi = require('joi')

const Pts = require('./../models/pts')
const auth = require('./../middlewares/auth')

const { messages: messagesValidation } = require('./../utils/validations')
const constants = require('./../constants')

const hook = (router) => {
  router.get('/api/messages/:collabId', auth, GetMessages),
  router.get('/api/messages/amount/:collabId', auth, GetAmount),
  router.post('/api/messages/:collabId/:ptsId', auth, updateMessage)
}

module.exports = { hook }

const GetMessages = async (req, res) => {
  try {
    await Joi.validate(req.params, messagesValidation.getMessages.params)
    await Joi.validate(req.query, messagesValidation.getMessages.query)
    const query = generateQuery(req)

    const ptsWithMessage = await Pts.find(query) || []
    const messages = ptsWithMessage.map(item => ({
      id: item._id,
      actor1: get(item, 'disagreement.handler',null),
      actor2: get(item, 'disagreement.creator',null),
      items: get(item, 'disagreement.messages',[])
    }))
    return res.status(200).send({messages})
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const GetAmount = async (req, res) => {
  try {
    await Joi.validate(req.params, messagesValidation.getMessages.params)
    await Joi.validate(req.query, messagesValidation.getMessages.query)
    const query = generateQuery(req)

    const amount = await Pts.find(query).count()

    return res.status(200).send({amount})
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const updateMessage = async (req, res) => {
  try {
    const pts = await Pts.findById(req.params.ptsId)
    pts.disagreement.messages =  req.body.message.items
    await Pts.findByIdAndUpdate(req.params.ptsId, pts)
    return res.status(200).send()
  } catch (error) {
    return error.isJoi
    ? res.status(400).send(error.details[0].message)
    : res.status(500).send(error)
  }
}

const generateQuery = (req) => {
  const query = { $and: [{ disagreement: { $ne: null } }] }

  if (!isUndefined(req.query.unread)) {
    query['$and'].push({
      'disagreement.messages': {$elemMatch: {isRead: req.query.unread, recipient: req.params.collabId}}
    })
  } else {
    switch (req.query.direction) {
      case constants.messages.RECEIVED:
        query['$and'].push({
          'disagreement.messages': {$elemMatch: {recipient: req.params.collabId}}
        })
        break
      case constants.messages.SENT:
        query['$and'].push({
          'disagreement.messages': {$elemMatch: {sender: req.params.collabId}}
        })
        break
      default:
        query['$and'].push({
          $or: [
            { 'disagreement.messages': {$elemMatch: {recipient: req.params.collabId}} },
            { 'disagreement.messages': {$elemMatch: {sender: req.params.collabId}} }
          ]
        })
        break
    }
  }
  return query
}
