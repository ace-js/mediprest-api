const Joi = require('joi')
const Collaborator = require('./../models/collaborator')
const Performer = require('./../models/performer')
const auth = require('./../middlewares/auth')
const admin = require('./../middlewares/admin')

const hook = (router) => {
  router.get('/api/collaborators/:inami/delegates/:id', auth, getCollaboratorDelegates),
  router.get('/api/collaborators/:id', auth, getCollaborators),
  //	router.post('/api/collaborators/:inami/delegates/:id', [auth, admin], addDelegate),
  router.post('/api/collaborators/:id/delegates/', auth, addDelegation)
}
module.exports = {
  hook
}

const getCollaborators = async (req, res) => {
  // where collab isn't delegate and not himself
  const collaborators = await Collaborator.find({
    _id: {
      $ne: req.params.id
    },
    roles: {
      $ne: 'Billing'
    }
  })
    .populate('department')
    .select('firstname name department')
  res.status(200).send(collaborators)
}

const getCollaboratorDelegates = async (req, res) => {
  const performer = await Performer.findById( req.params.inami)
    .select('-_id delegates')
  res.status(200).send(performer.delegates)
}

const addDelegation = async (req, res) => {
  
}
