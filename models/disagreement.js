const mongoose = require('mongoose')
const Collaborator = require('./collaborator')
const messageSchema = require('./message')

const disagreementSchema = new mongoose.Schema({
  comment: {
    type: String,
    maxlength: 2000
  },
  traited: {
    type: Boolean,
    default: false
  },
  messages: [messageSchema],
  handler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator',
    required: false,
    default: null
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator',
    required: true
  }
})

module.exports = disagreementSchema
