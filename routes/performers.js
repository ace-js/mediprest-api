const Joi = require('joi')
const findIndex = require('lodash/findIndex')
const Performer = require('./../models/performer')
const Collaborator = require('./../models/collaborator')
const auth = require('./../middlewares/auth')

const DELEGATE ='Delegate'

const hook = (router) => {
  router.get('/api/performers/:id', auth, getDelegationsPerformers)
  router.post('/api/performers/delegates/:id', auth, updateDelegates)
}

const getDelegationsPerformers = async (req, res) => {
  let performers = await Performer.find({ delegates: req.params.id })
    .populate('collaborator', 'firstname name')
    .select('_id collaborator')

  performers = performers.map((performer) => {
    return {
      _id: performer.collaborator._id,
      inami: performer._id,
      name: performer.collaborator.name,
      firstname: performer.collaborator.firstname
    }
  })
  res.status(200).send(performers)
}

const updateDelegates = async (req, res) => {
  const performer = await Performer.findById(req.params.id)
  const delegatesToRemove = performer.delegates.filter(delegate => 
    findIndex(req.body.delegates, innerItem => innerItem === delegate) === -1
  )
 
  await delegatesToRemove.map(async (delegate) => {
    const delegateToRemove = await Collaborator.findById(delegate)
    delegateToRemove.performers = delegateToRemove.performers.filter(performer => performer !== req.params.id)
    delegateToRemove.roles = delegateToRemove.performers.length === 0 
    ? delegateToRemove.roles.filter(role => role !== DELEGATE)
    : delegateToRemove.roles
    await Collaborator.findByIdAndUpdate(delegate, { performers: delegateToRemove.performers, roles: delegateToRemove.roles })
  })

  const delegatesToAdd = req.body.delegates.filter(delegate => 
    findIndex(performer.delegates, innerItem => innerItem === delegate) === -1
    )

    await  delegatesToAdd.map(async (delegate) => {
      const delegateToAdd = await Collaborator.findById(delegate)
      delegateToAdd.performers = [...delegateToAdd.performers,  req.params.id]
      delegateToAdd.roles = findIndex(delegateToAdd.roles, role => role === DELEGATE) === -1 
      ? [...delegateToAdd.roles, DELEGATE]
      : delegateToAdd.roles
      await Collaborator.findByIdAndUpdate(delegate, { performers: delegateToAdd.performers, roles: delegateToAdd.roles })
    })

    await Performer.findByIdAndUpdate(req.params.id, {delegates: req.body.delegates})
  return res.status(200).send()
}

module.exports = { hook }
