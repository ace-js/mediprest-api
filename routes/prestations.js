const { filter, isNull } = require('lodash')
const Joi = require('joi')

const Prestation = require('./../models/prestation')
const Performer = require('./../models/performer')
const auth = require('./../middlewares/auth')
const delegateOrAdmin = require('./../middlewares/delegateOrAdmin')
const { prestations: prestaValidation } = require('./../utils/validations')

const hook = router => {
  router.get('/api/prestations', auth, getPrestations)
  router.get(
    '/api/prestations/:id',
    auth,
    delegateOrAdmin,
    getPerformerPrestations
  )
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
    }).populate('prestations')
    if (!performer || isNull(performer.prestations)) {
      return res.status(404)
    }
    console.log('FAV ? ', req.query.isFavorite)
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
