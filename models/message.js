const mongoose = require('mongoose')
const Collaborator = require('./collaborator')

const messageSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  content: {
    type: String,
    minlength: 2,
    maxlength: 2000,
    required: true
  },
  sendDate: {
    type: Date,
    default: new Date()
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readDate: {
    type: Date,
    default: null
  },
  sendByDelegate: {
    type: Boolean,
    default: false
  }

})

module.exports = messageSchema
