const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const Prestation = mongoose.model('Prestation', new mongoose.Schema({
  _id: {
    type: String,
    maxlength: 8
  },
  label: {
    type: String,
    maxlength: 255,
    required: true
  }
}).plugin(mongoosePaginate))

module.exports = Prestation
