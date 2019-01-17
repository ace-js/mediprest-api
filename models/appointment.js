const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  label: {
    type: String,
    required: true,
    maxlength: 255
  }
})

module.exports = appointmentSchema
