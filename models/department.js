const mongoose = require('mongoose')

const Department = mongoose.model('Department', new mongoose.Schema({
  name: String
}))

module.exports = Department
