const Joi = require('joi')
const _ = require('lodash')
const Collaborator = require('./../models/collaborator')
const Performer = require('./../models/performer')
const password = require('./../utils/password')
const { auth } = require('./../utils/validations')

const hook = (router) => {
  router.post('/api/auth/login', login)
  router.post('/api/auth/register', register)
}

const login = async (req, res) => {
  const {
    error
  } = Joi.validate(req.body, auth.credentials)
  error && res.status(400).send(error.details[0].message)

  let collaborator = await Collaborator.findOne({username: req.body.username})
  !collaborator && res.status(400).send('Unauthorized')

  const authSuccess = await password.verifyPasswordHash(req.body.password, collaborator.passwordHash, collaborator.passwordSalt)
  collaborator = await Collaborator.findOne({
    username: collaborator.username
  })
    .populate('department', 'name')
    .select('-passwordHash -passwordSalt -performers -username')
  if (authSuccess && collaborator.roles.length > 0) {
    const performer = await Performer.findOne({ collaborator: collaborator._id })
    collaborator.inami = performer ? performer._id : null
    const token = collaborator.generateAuthToken()
    res.set('x-auth-token', token)
    return res.status(200).send({collaborator: _.pick(collaborator, ['_id', 'roles', 'firstname', 'name', 'department', 'inami'])})
  }
  res.status(401).send('Unauthorized')
}

const register = async (req, res) => {
  const {
    error
  } = Joi.validate(req.body, auth.collaborator)
  error && res.status(400).send(error.details[0].message)

  let collaborator = await Collaborator.findOne({
    username: req.body.username.toLowerCase()
  })
  collaborator && res.status(400).send('Username already taken')

  const hashs = password.createPasswordHash(req.body.password)
  collaborator = new Collaborator({
    firstname: req.body.firstname,
    name: req.body.name,
    username: req.body.username,
    roles: req.body.roles,
    performers: req.body.performers,
    department: req.body.department,
    passwordHash: hashs.passwordHash,
    passwordSalt: hashs.passwordSalt
  })

  try {
    collaborator = await collaborator.save()
    res.send(collaborator)
  } catch (error) {
    return res.status(400).send(error.errors[0].message)
  }
}
module.exports = {
  hook
}
