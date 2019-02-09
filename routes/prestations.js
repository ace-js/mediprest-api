const { filter, isNull, find } = require('lodash')
const Joi = require('joi')

const Prestation = require('./../models/prestation')
const Performer = require('./../models/performer')
const auth = require('./../middlewares/auth')
const delegateOrAdmin = require('./../middlewares/delegateOrAdmin')
const admin = require('./../middlewares/admin')
const { prestations: prestaValidation } = require('./../utils/validations')

const hook = router => {
  router.get('/api/prestations', auth, getPrestations)
  router.get(
    '/api/prestations/:id',
    auth,
    delegateOrAdmin,
    getPerformerPrestations
  )
  router.get(
    '/api/prestations-all/:inami',
    auth,
    getAllPerformerPrestations
  )
  router.post(
    '/api/prestations/:inami/:id',
    auth,
    admin,
    updatePrestations
  )
  updatePrestations
}

module.exports = { hook }

const getPrestations = async (req, res) => {
  try {
    const prestations = await Prestation.find()
    return res.status(200).send(prestations)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getPerformerPrestations = async (req, res) => {
  try {
    await Joi.validate(req.query, prestaValidation.performerPrestations)
    const performer = await Performer.findOne({
      collaborator: req.params.id
    })
    if (!performer || isNull(performer.prestations)) {
      return res.status(404)
    }
    const prestations = req.query.isFavorite
      ? filter(performer.prestations, presta => presta.isFavorite === true).map(presta => presta._id)
      : performer.prestations.map(presta => presta._id)
    const favoritePrestations = await Prestation.find({
      _id: { $in: prestations }
    })
    return res.status(200).send(favoritePrestations)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getAllPerformerPrestations = async (req, res) => {
  try {
    const performer = await Performer.findById(req.params.inami)
    if (!performer || isNull(performer.prestations)) {
      return res.status(404).send()
    }
    const prestationsNames = await Prestation.find({
      _id: { $in: performer.prestations }
    })

    const prestationsToSend = performer.prestations.map(prestation => {
      const prestationWithName = find(prestationsNames, item => item._id === prestation._id) || {}
      return {
        isFavorite: prestation.isFavorite,
        _id: prestation._id,
        label: prestationWithName.label,
        times: prestation.amount,
      }
    })
    return res.status(200).send(prestationsToSend)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const updatePrestations = async(req, res) => {
  try {
    await Performer.findByIdAndUpdate(req.params.inami, {prestations: req.body.prestations})
    return res.status(200).send()
  } catch (error) {
    return res.status(500).send(error)
  }
}
