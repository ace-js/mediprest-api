const Joi = require('joi')
const Collaborator = require('./../models/collaborator')
const auth = require('./../middlewares/auth')
const admin = require('./../middlewares/admin')

const hook = (router) => {
  router.get('/api/collaborators/:inami/delegates/:id', auth, getCollaboratorDelegates),
  router.get('/api/collaborators/:inami/:id', auth, getCollaborators),
  //	router.post('/api/collaborators/:inami/delegates/:id', [auth, admin], addDelegate),
  router.delete('/api/collaborators/:inami/delegates/:id', auth, removeDelegate)
}
module.exports = {
  hook
}

const getCollaborators = async (req, res) => {
  // where collab isn't delegate and not himself
  const collaborators = await Collaborator.find({
    performers: {
      $ne: req.params.inami
    },
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
  const collaborators = await Collaborator.find({
    performers: req.params.inami
  })
    .populate('department')
    .select('firstname name department')
  res.status(200).send(collaborators)
}

const removeDelegate = async (req, res) => {

}
