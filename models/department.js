const mongoose = require('mongoose')

const Department = mongoose.model('Department', new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}))

module.exports = Department
