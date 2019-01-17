const mongoose = require('mongoose')

const patientSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true
  },
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 60,
    required: true
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return new Date(value).getTime() <= new Date().getTime()
      },
      message: 'Patient cant be born later than today'
    }
  },
  sexe: {
    type: String,
    required: true,
    maxlength: 1,
    enum: ['M', 'F']
  },
  photoUrl: {
    type: String,
    required: true
  }

})

module.exports = patientSchema
