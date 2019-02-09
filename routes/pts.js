const Joi = require('joi')
const { findIndex, omit } = require('lodash')
const mongoose = require('mongoose')

const Performer = require('./../models/performer')
const Collaborator = require('./../models/collaborator')
const Pts = require('./../models/pts')
const { auth, billing, delegateOrAdmin } = require('./../middlewares')
const { pts } = require('./../utils/validations')
const constants = require('./../constants')

const hook = (router) => {
  router.get('/api/pts/:inami', auth, getPtsPerformer)
  router.get('/api/pts/billing/:collabId', auth, billing, getPtsBilling)
  router.post(
    '/api/pts/validation/:id/:inami',
    auth,
    delegateOrAdmin,
    createPts
  )
  router.post(
    '/api/pts/validation/update/:id/:ptsId',
    auth,
    delegateOrAdmin,
    updatePts
  )
  router.post('/api/pts/billing/update/:id/:ptsId', auth, billing, updatePts)
}

module.exports = { hook }

const getPtsPerformer = async (req, res) => {
  try {
    await Joi.validate(req.query, pts.pts_validation.query)
    await Joi.validate(req.params, pts.pts_validation.params)
    const { query, options } = generateQueryOptions(req)

    const result = await Pts.paginate(query, options)
    res.send(result)
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const getPtsBilling = async (req, res) => {
  try {
    await Joi.validate(req.query, pts.pts_billing.query)
    await Joi.validate(req.params, pts.pts_billing.params)
    const { query, options } = generateQueryOptions(req)

    const result = await Pts.paginate(query, options)
    res.send(result)
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const createPts = async (req, res) => {
  try {
    await Joi.validate(req.body.pts, pts.createPts.body)
    if (req.body.pts.performer !== req.params.inami ) {
      return res
        .status(400)
        .send('The performer for the prestation must be the same of your param')
    }

    const response = await Pts.create(req.body.pts)
    const performer = await Performer.findById(req.params.inami)
    const indexPresta = findIndex(
      performer.prestations,
      (presta) => presta._id === req.body.pts.prestation
    )

    if (indexPresta === -1) {
      performer.prestations.push({
        _id: req.body.pts.prestation,
        amount: 1,
        isFavorite: false
      })
    } else {
      performer.prestations[indexPresta].amount++
    }

    await Performer.update(performer)
    return res.status(200).send(response)
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const updatePts = async (req, res) => {
  try {
    await Joi.validate(req.params, pts.updatePts.params)
    await Joi.validate(req.body, pts.updatePts.body)
    const response = await Pts.findByIdAndUpdate(req.params.ptsId, req.body.pts)
    return res.status(200).send(response)
  } catch (error) {
    return error.isJoi
      ? res.status(400).send(error.details[0].message)
      : res.status(500).send(error)
  }
}

const generateQueryOptions = (req) => {
  const query = {}
  const options = {
    // default values
    page: 1,
    limit: 10
  }
  if (req.query.contactType && req.query.contactType !== constants.pts.NONE) {
    // si il y a un filtre sur le type de contact
    query.typeContact = req.query.contactType
  }

  if (req.params.inami) {
    query.performer = req.params.inami
  }

  if (req.query.status && req.query.status !== constants.pts.NONE) {
    // si il y a un filtre sur le status
    switch (req.query.status) {
      case constants.pts.VALIDATED:
        query.isValidated = true
        break
      case constants.pts.DISAGREED:
        query.disagreement = { $ne: null }
        break
      case constants.pts.NOT_TRAITED:
        query.isValidated = false
        query.disagreement = { $eq: null }
        break
      case constants.pts.TRAITED:
        query['$or'] = [
          { isValidated: { $eq: true } },
          { disagreement: { $ne: null } }
        ]
        break
      case constants.pts.DISAGREED_NT:
        query['$and'] = [
          { disagreement: { $ne: null } },
          { 'disagreement.handler': null }
        ]
        break
      case constants.pts.DISAGREED_HANDLED_BY_ME:
        query['$and'] = [
          { disagreement: { $ne: null } },
          {
            'disagreement.handler': mongoose.Types.ObjectId(req.params.collabId)
          }
        ]
        break
    }
  }

  if (req.query.dateStart || req.query.dateEnd) {
    query.prestationDate =
      req.query.dateStart && req.query.dateEnd
        ? {
            $gte: new Date(req.query.dateStart),
            $lte: new Date(req.query.dateEnd)
          }
        : req.query.dateStart
        ? { $gte: new Date(req.query.dateStart) }
        : { $lte: new Date(req.query.dateEnd) }
  }

  if (req.query.sortBy) {
    // si il y a un sort
    const direction = req.query.sortDirection
      ? req.query.sortDirection === constants.pts.ASC
        ? 1
        : -1
      : 1
    switch (req.query.sortBy) {
      case constants.pts.CONTACT:
        options.sort = { [constants.pts.CONTACT]: direction }
        break
      case constants.pts.PATIENT:
        options.sort = { [constants.pts.PATIENT]: { _id: direction } }
        break
      case constants.pts.CONTACT_TYPE:
        options.sort = { [constants.pts.CONTACT_TYPE]: direction }
        break
      case constants.pts.PRESTATION:
        options.sort = { [constants.pts.PRESTATION]: direction }
        break
      default:
        options.sort = { [constants.pts.PRESTATION_DATE]: direction }
        break
    }
    options.sort = { [req.query.sortBy]: direction }
  }

  if (req.query.page) {
    // si il y a une page spécifique
    options.page = parseInt(req.query.page)
  }
  if (req.query.limit) {
    // si il y a une limite
    options.limit = parseInt(req.query.limit)
  }
  query.isInvoiced = req.query.isInvoiced

  options.populate = [
    { path: 'prestation' },
    { path: 'performer', select: '-delegates -prestations' },
    { path: 'validatedBy', select: 'name firstname _id' },
    { path: 'disagreement.creator', select: 'name firstname _id' },
    { path: 'disagreement.handler', select: 'name firstname _id' },
    { path: 'invoicedBy', select: 'name firstname _id' }
  ]

  return { query, options }
}
