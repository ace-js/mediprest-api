const collaborators = require('./collaborators')
const auth = require('./auth')
const messages = require('./messages')
const performers = require('./performers')
const pts = require('./pts')
const prestations = require('./prestations')
const router = require('express').Router()

auth.hook(router)
collaborators.hook(router)
messages.hook(router)
performers.hook(router)
pts.hook(router)
prestations.hook(router)

module.exports = router
