const Joi = require('joi')
const Performer = require('./../models/performer')
const auth = require('./../middlewares/auth')
const hook = (router) => {
  router.get('/api/performers/:id', auth, getDelegationsPerformers)
}

const getDelegationsPerformers = async (req, res) => {
  let performers = await Performer.find({delegates: req.params.id })
    .populate('collaborator', 'firstname name')
    .select('_id collaborator')

  performers = performers.map(performer => {
    return {
      _id: performer.collaborator._id,
      inami: performer._id,
      name: performer.collaborator.name,
      firstname: performer.collaborator.firstname
    }
  })
  res.status(200).send(performers)
}

module.exports = {hook}
